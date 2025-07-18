let profileData = {
  id: "1",
  name: "John Doe",
  bio: "Full-stack developer passionate about creating amazing user experiences. I love working with modern technologies and building scalable applications that make a difference.",
  email: "john.doe@example.com",
  phone: "+1 (555) 123-4567",
  location: "San Francisco, CA",
  updatedAt: new Date().toISOString(),
};

export async function getProfile() {
  try {
    await new Promise((resolve) => setTimeout(resolve, 100));

    return JSON.parse(JSON.stringify(profileData));
  } catch (error) {
    console.error("Profile service error:", error);
    throw new Error("Failed to get profile data");
  }
}

export async function updateProfile(updates: Partial<typeof profileData>) {
  try {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const updatedProfile = {
      ...profileData,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    profileData = updatedProfile;

    console.log("Profile updated successfully:", updatedProfile);

    return JSON.parse(JSON.stringify(updatedProfile));
  } catch (error) {
    console.error("Profile update service error:", error);
    throw new Error("Failed to update profile data");
  }
}

export function getCurrentTimestamp() {
  return new Date().toISOString();
}
