"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { profileSchema, type ProfileFormData } from "@/lib/validations";
import { useAppStore } from "@/lib/store";
import { useAuth } from "@/lib/auth";
import { AuthGuard } from "@/components/auth-guard";
import { useRouter } from "next/navigation";
import { useEffect, useCallback } from "react";
import Link from "next/link";

function EditProfileContent() {
  const { showToast } = useAppStore();
  const { user, logout } = useAuth();
  const queryClient = useQueryClient();
  const router = useRouter();

  const {
    data: profileData,
    isLoading,
    error,
    refetch,
    dataUpdatedAt,
  } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      console.log("Fetching profile data...");
      try {
        const response = await fetch("/api/profile", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Cache-Control": "no-cache",
          },
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log("Profile data fetched:", result);

        if (!result.success) {
          throw new Error(result.error || "Failed to fetch profile");
        }

        return result.data;
      } catch (error) {
        console.error("Profile fetch error:", error);
        throw error;
      }
    },
    staleTime: 0,
    gcTime: 0,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    retry: 3,
    retryDelay: 1000,
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty, isSubmitting },
    reset,
    setValue,
    watch,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "",
      bio: "",
      email: "",
      phone: "",
      location: "",
    },
  });

  const watchedValues = watch();

  const resetFormWithProfileData = useCallback(
    (data: any) => {
      if (data) {
        console.log("Resetting form with data:", data);
        const formData = {
          name: data.name || "",
          bio: data.bio || "",
          email: data.email || "",
          phone: data.phone || "",
          location: data.location || "",
        };

        Object.entries(formData).forEach(([key, value]) => {
          setValue(key as keyof ProfileFormData, value);
        });

        reset(formData);
        console.log("Form reset complete with values:", formData);
      }
    },
    [setValue, reset]
  );

  useEffect(() => {
    if (profileData) {
      resetFormWithProfileData(profileData);
    }
  }, [profileData, dataUpdatedAt, resetFormWithProfileData]);

  const updateProfileMutation = useMutation({
    mutationFn: async (data: ProfileFormData) => {
      console.log("Updating profile with data:", data);
      try {
        const response = await fetch("/api/profile", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Cache-Control": "no-cache",
          },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log("Profile update response:", result);

        if (!result.success) {
          throw new Error(result.error || "Failed to update profile");
        }

        return result;
      } catch (error) {
        console.error("Profile update error:", error);
        throw error;
      }
    },
    onMutate: async (newData) => {
      console.log("Mutation starting with data:", newData);
      await queryClient.cancelQueries({ queryKey: ["profile"] });
      const previousProfile = queryClient.getQueryData(["profile"]);
      console.log("Previous profile data:", previousProfile);
      const optimisticData = {
        ...(previousProfile as object),
        ...newData,
        updatedAt: new Date().toISOString(),
      };

      queryClient.setQueryData(["profile"], optimisticData);
      console.log("Optimistic update applied:", optimisticData);

      return { previousProfile };
    },
    onError: (error, newData, context) => {
      console.error("Mutation error:", error);
      if (context?.previousProfile) {
        queryClient.setQueryData(["profile"], context.previousProfile);
        console.log("Rolled back to previous data:", context.previousProfile);
      }
      showToast(error.message || "Failed to update profile", "error");
    },
    onSuccess: (data, variables) => {
      console.log("Mutation success:", data);
      queryClient.setQueryData(["profile"], data.data);
      showToast(data.message || "Profile updated successfully!", "success");
      resetFormWithProfileData(data.data);
    },
    onSettled: async () => {
      console.log("Mutation settled, invalidating queries...");
      await queryClient.invalidateQueries({ queryKey: ["profile"] });
      await refetch();
    },
  });

  const onSubmit = useCallback(
    (data: ProfileFormData) => {
      console.log("Form submitted with data:", data);
      console.log("Current watched values:", watchedValues);
      updateProfileMutation.mutate(data);
    },
    [updateProfileMutation, watchedValues]
  );

  const handlePreviewProfile = useCallback(() => {
    router.push("/profile");
  }, [router]);

  const handleRefresh = useCallback(async () => {
    console.log("Manual refresh triggered");
    await queryClient.invalidateQueries({ queryKey: ["profile"] });
    await refetch();
  }, [queryClient, refetch]);

  const handleLogout = () => {
    logout();
    showToast("Logged out successfully", "success");
    router.push("/login");
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <Card className="max-w-2xl mx-auto">
          <CardContent className="flex items-center justify-center p-8">
            <div className="flex items-center gap-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <p>Loading profile data...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <Card className="max-w-2xl mx-auto">
          <CardContent className="p-8 text-center">
            <p className="text-destructive mb-4">Failed to load profile data</p>
            <p className="text-sm text-muted-foreground mb-4">
              {error.message}
            </p>
            <div className="flex gap-2 justify-center">
              <Button onClick={handleRefresh} variant="outline">
                Try Again
              </Button>
              <Link href="/profile">
                <Button variant="outline">Go to Profile</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto py-12 px-4">
        <div className="max-w-3xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-slate-200 mb-6">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-slate-600">
                Logged in as {user?.name || user?.email}
              </span>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent mb-3">
              Edit Your Profile
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Update your information to keep your profile current and
              professional
            </p>
          </div>

          {/* Main Edit Card */}
          <Card className="overflow-hidden border-0 shadow-xl bg-white/80 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white">
              <CardTitle className="flex items-center justify-between text-white">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                  </div>
                  <span className="text-xl">Profile Information</span>
                </div>
                <div className="flex items-center gap-3">
                  {isDirty && (
                    <div className="flex items-center gap-2 bg-orange-500/20 backdrop-blur-sm px-3 py-1 rounded-full border border-orange-300/30">
                      <div className="w-2 h-2 bg-orange-300 rounded-full animate-pulse"></div>
                      <span className="text-sm font-medium text-orange-100">
                        Unsaved changes
                      </span>
                    </div>
                  )}
                  <Button
                    onClick={handleRefresh}
                    variant="outline"
                    size="sm"
                    className="bg-white/20 border-white/30 text-white hover:bg-white/30"
                  >
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      />
                    </svg>
                    Refresh
                  </Button>
                  <Button
                    onClick={handleLogout}
                    variant="outline"
                    size="sm"
                    className="bg-red-500/20 border-red-300/30 text-red-100 hover:bg-red-500/30"
                  >
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                      />
                    </svg>
                    Logout
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>

            <CardContent className="p-8">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                {/* Name Field */}
                <div className="space-y-3">
                  <Label
                    htmlFor="name"
                    className="text-base font-semibold text-slate-700 flex items-center gap-2"
                  >
                    <div className="w-5 h-5 bg-blue-100 rounded flex items-center justify-center">
                      <svg
                        className="w-3 h-3 text-blue-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                    </div>
                    Full Name
                  </Label>
                  <Input
                    id="name"
                    {...register("name")}
                    placeholder="Enter your full name"
                    className={`h-12 text-base ${
                      errors.name
                        ? "border-red-500 focus:border-red-500 bg-red-50"
                        : "border-slate-300 focus:border-blue-500 bg-white"
                    } transition-colors`}
                  />
                  {errors.name && (
                    <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg border border-red-200">
                      <svg
                        className="w-4 h-4 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <p className="text-sm font-medium">
                        {errors.name.message}
                      </p>
                    </div>
                  )}
                </div>

                {/* Bio Field */}
                <div className="space-y-3">
                  <Label
                    htmlFor="bio"
                    className="text-base font-semibold text-slate-700 flex items-center gap-2"
                  >
                    <div className="w-5 h-5 bg-green-100 rounded flex items-center justify-center">
                      <svg
                        className="w-3 h-3 text-green-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                    </div>
                    Professional Bio
                  </Label>
                  <Textarea
                    id="bio"
                    {...register("bio")}
                    placeholder="Tell us about yourself, your experience, and what makes you unique..."
                    rows={5}
                    className={`text-base resize-none ${
                      errors.bio
                        ? "border-red-500 focus:border-red-500 bg-red-50"
                        : "border-slate-300 focus:border-blue-500 bg-white"
                    } transition-colors`}
                  />
                  {errors.bio && (
                    <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg border border-red-200">
                      <svg
                        className="w-4 h-4 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <p className="text-sm font-medium">
                        {errors.bio.message}
                      </p>
                    </div>
                  )}
                </div>

                {/* Contact Information Section */}
                <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                  <h3 className="text-lg font-semibold text-slate-900 mb-6 flex items-center gap-2">
                    <div className="w-6 h-6 bg-indigo-100 rounded-lg flex items-center justify-center">
                      <svg
                        className="w-4 h-4 text-indigo-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    Contact Information
                  </h3>

                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Email Field */}
                    <div className="space-y-3">
                      <Label
                        htmlFor="email"
                        className="text-base font-semibold text-slate-700 flex items-center gap-2"
                      >
                        <div className="w-5 h-5 bg-blue-100 rounded flex items-center justify-center">
                          <svg
                            className="w-3 h-3 text-blue-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                            />
                          </svg>
                        </div>
                        Email Address
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        {...register("email")}
                        placeholder="your.email@example.com"
                        className={`h-12 text-base ${
                          errors.email
                            ? "border-red-500 focus:border-red-500 bg-red-50"
                            : "border-slate-300 focus:border-blue-500 bg-white"
                        } transition-colors`}
                      />
                      {errors.email && (
                        <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg border border-red-200">
                          <svg
                            className="w-4 h-4 flex-shrink-0"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          <p className="text-sm font-medium">
                            {errors.email.message}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Phone Field */}
                    <div className="space-y-3">
                      <Label
                        htmlFor="phone"
                        className="text-base font-semibold text-slate-700 flex items-center gap-2"
                      >
                        <div className="w-5 h-5 bg-green-100 rounded flex items-center justify-center">
                          <svg
                            className="w-3 h-3 text-green-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                            />
                          </svg>
                        </div>
                        Phone Number
                      </Label>
                      <Input
                        id="phone"
                        {...register("phone")}
                        placeholder="+1 (555) 123-4567"
                        className={`h-12 text-base ${
                          errors.phone
                            ? "border-red-500 focus:border-red-500 bg-red-50"
                            : "border-slate-300 focus:border-blue-500 bg-white"
                        } transition-colors`}
                      />
                      {errors.phone && (
                        <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg border border-red-200">
                          <svg
                            className="w-4 h-4 flex-shrink-0"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          <p className="text-sm font-medium">
                            {errors.phone.message}
                          </p>
                        </div>
                      )}
                      <p className="text-xs text-slate-500 bg-slate-100 p-2 rounded border">
                        Supported formats: +1 (555) 123-4567, 555-123-4567,
                        555.123.4567
                      </p>
                    </div>
                  </div>

                  {/* Location Field */}
                  <div className="space-y-3 mt-6">
                    <Label
                      htmlFor="location"
                      className="text-base font-semibold text-slate-700 flex items-center gap-2"
                    >
                      <div className="w-5 h-5 bg-purple-100 rounded flex items-center justify-center">
                        <svg
                          className="w-3 h-3 text-purple-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                      </div>
                      Location
                    </Label>
                    <Input
                      id="location"
                      {...register("location")}
                      placeholder="City, State/Country"
                      className={`h-12 text-base ${
                        errors.location
                          ? "border-red-500 focus:border-red-500 bg-red-50"
                          : "border-slate-300 focus:border-blue-500 bg-white"
                      } transition-colors`}
                    />
                    {errors.location && (
                      <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg border border-red-200">
                        <svg
                          className="w-4 h-4 flex-shrink-0"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <p className="text-sm font-medium">
                          {errors.location.message}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 pt-8 border-t border-slate-200">
                  <Button
                    type="submit"
                    disabled={
                      updateProfileMutation.isPending ||
                      !isDirty ||
                      isSubmitting
                    }
                    className="flex-1 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {updateProfileMutation.isPending || isSubmitting ? (
                      <>
                        <svg
                          className="w-4 h-4 mr-2 animate-spin"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                          />
                        </svg>
                        Saving Changes...
                      </>
                    ) : (
                      <>
                        <svg
                          className="w-4 h-4 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        Save Changes
                      </>
                    )}
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={handlePreviewProfile}
                    className="flex-1 h-12 bg-white/80 backdrop-blur-sm border-slate-300 hover:bg-white hover:shadow-md transition-all duration-200"
                  >
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                    Preview Profile
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Cancel Button */}
          <div className="text-center mt-8">
            <Link href="/profile">
              <Button
                variant="outline"
                className="bg-white/80 backdrop-blur-sm border-slate-300 hover:bg-white hover:shadow-md transition-all duration-200"
              >
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
                Cancel & Return
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function EditProfilePage() {
  return (
    <AuthGuard>
      <EditProfileContent />
    </AuthGuard>
  );
}
