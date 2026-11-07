import { useEffect, useState, useCallback } from "react";
import { predictSkillCategory, getCareerAlignment } from "../api/api";
import { ProfileContext } from "./profileContextObject";

const STORAGE_KEY = "skilllens_profile_state";

function loadStoredState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function ProfileProvider({ children }) {
  const [profile, setProfile] = useState(() => loadStoredState()?.profile ?? null);
  const [skillCategoryResult, setSkillCategoryResult] = useState(
    () => loadStoredState()?.skillCategoryResult ?? null
  );
  const [careerAlignmentResult, setCareerAlignmentResult] = useState(
    () => loadStoredState()?.careerAlignmentResult ?? null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Persist whenever the meaningful state changes, so a page refresh doesn't lose it.
  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ profile, skillCategoryResult, careerAlignmentResult })
    );
  }, [profile, skillCategoryResult, careerAlignmentResult]);

  const analyzeProfile = useCallback(async (newProfile) => {
    setLoading(true);
    setError(null);
    // Clear any previous results immediately, so a page never shows an old
    // category/alignment result while a new profile is being analyzed.
    setSkillCategoryResult(null);
    setCareerAlignmentResult(null);
    try {
      const [categoryResult, alignmentResult] = await Promise.all([
        predictSkillCategory(newProfile),
        getCareerAlignment(newProfile),
      ]);
      setProfile(newProfile);
      setSkillCategoryResult(categoryResult);
      setCareerAlignmentResult(alignmentResult);
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearProfile = useCallback(() => {
    setProfile(null);
    setSkillCategoryResult(null);
    setCareerAlignmentResult(null);
    setError(null);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const value = {
    profile,
    skillCategoryResult,
    careerAlignmentResult,
    loading,
    error,
    analyzeProfile,
    clearProfile,
  };

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
}
