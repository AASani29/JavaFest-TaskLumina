import React, { useEffect, useState } from "react";
import "../CSS Files/Achievements.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMedal } from "@fortawesome/free-solid-svg-icons";
import { getAchievements } from "../Common/user-service";
import { getCurrentUser } from "../Common/Auth";
import { useNavigate } from "react-router-dom";
import Sidebar from "../Common/Sidebar";
import Topbar from "../Common/Topbar";

const loadScript = (src, async = true, defer = true) => {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = src;
    script.async = async;
    script.defer = defer;
    script.onload = resolve;
    script.onerror = reject;
    document.body.appendChild(script);
  });
};

const Achievements = () => {
  const navigate = useNavigate();
  const [achievements, setAchievements] = useState([]);

  useEffect(() => {
    const loadBotpressScripts = async () => {
      try {
        await loadScript("https://cdn.botpress.cloud/webchat/v1/inject.js");
        await loadScript(
          "https://mediafiles.botpress.cloud/6f06300e-840b-4711-b2ac-8e9d5f7d4bf5/webchat/config.js"
        );
      } catch (error) {
        console.error("Failed to load Botpress scripts:", error);
      }
    };
    const user = getCurrentUser();
    if (!user) {
      navigate("/login");
    } else {
      fetchAchievements(user.id);
    }
    loadBotpressScripts();
  }, [navigate]);

  const fetchAchievements = async (userId) => {
    try {
      const data = await getAchievements(userId);
      setAchievements(data || []);
    } catch (error) {
      console.error("Failed to fetch achievements:", error);
    }
  };

  const badgeDescriptions = {
    "Rookie Starter": "Earned by completing first task of the month",
    "Daily Achiever": "Earned by completing all tasks in a single day.",
    "Weekly Warrior":
      "Earned by completing all tasks every day for a full week.",
    "Monthly Master":
      "Earned by completing all tasks every day for a full month.",
    "Consistent Performer":
      "Earned by completing at least one task every day for 15 consecutive days.",
    "Task Marathoner": "Earned by completing 10 tasks in a single day.",
    "Weekend Warrior":
      "Earned by completing all tasks on both Saturday and Sunday.",
    "Early Bird": "Earned by completing the first task of the day before 9 AM.",
  };

  const allBadges = [
    "Rookie Starter",
    "Daily Achiever",
    "Weekly Warrior",
    "Monthly Master",
    "Consistent Performer",
    "Task Marathoner",
    "Weekend Warrior",
    "Early Bird",
  ];

  const isBadgeEarned = (badge) => {
    return achievements.some((achievement) => achievement.badge === badge);
  };

  return (
    <div className="dashboard">
      <Sidebar />
      <main className="content">
        <Topbar />

        <div className="achievements">Badges</div>
        <div className="achievements-container">
          <div className="badge-list">
            {allBadges.map((badge, index) => (
              <div
                className={`achievement-item ${
                  isBadgeEarned(badge) ? "earned" : ""
                }`}
                key={index}
              >
                <div className="achievement-header">
                  <FontAwesomeIcon
                    icon={faMedal}
                    className={`medal-icon ${
                      isBadgeEarned(badge) ? "earned" : ""
                    }`}
                  />
                  <span
                    className={`achievement-name ${
                      isBadgeEarned(badge) ? "earned" : ""
                    }`}
                  >
                    {badge}
                  </span>
                </div>
                <div
                  className={`achievement-description ${
                    isBadgeEarned(badge) ? "earned" : ""
                  }`}
                >
                  {badgeDescriptions[badge]}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Achievements;
