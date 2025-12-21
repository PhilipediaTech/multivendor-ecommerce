"use client";

import { useState } from "react";

export default function EmailPreferences({ userId }) {
  const [preferences, setPreferences] = useState({
    orderConfirmation: true,
    orderUpdates: true,
    promotions: false,
    newsletter: false,
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const handleToggle = (key) => {
    setPreferences({
      ...preferences,
      [key]: !preferences[key],
    });
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage("");

    try {
      // API call to save preferences would go here
      // For now, just show success message
      await new Promise((resolve) => setTimeout(resolve, 500));
      setMessage("Preferences saved successfully!");
    } catch (error) {
      setMessage("Failed to save preferences");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Email Notifications
      </h2>
      <p className="text-gray-600 mb-6">
        Choose which emails you'd like to receive from us
      </p>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-gray-900">Order Confirmations</p>
            <p className="text-sm text-gray-600">
              Receive email when you place an order
            </p>
          </div>
          <button
            onClick={() => handleToggle("orderConfirmation")}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
              preferences.orderConfirmation ? "bg-primary-600" : "bg-gray-200"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                preferences.orderConfirmation
                  ? "translate-x-6"
                  : "translate-x-1"
              }`}
            />
          </button>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-gray-900">Order Updates</p>
            <p className="text-sm text-gray-600">
              Get notified when your order status changes
            </p>
          </div>
          <button
            onClick={() => handleToggle("orderUpdates")}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
              preferences.orderUpdates ? "bg-primary-600" : "bg-gray-200"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                preferences.orderUpdates ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-gray-900">Promotions</p>
            <p className="text-sm text-gray-600">
              Receive special offers and discounts
            </p>
          </div>
          <button
            onClick={() => handleToggle("promotions")}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
              preferences.promotions ? "bg-primary-600" : "bg-gray-200"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                preferences.promotions ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-gray-900">Newsletter</p>
            <p className="text-sm text-gray-600">
              Get our weekly newsletter with tips and trends
            </p>
          </div>
          <button
            onClick={() => handleToggle("newsletter")}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
              preferences.newsletter ? "bg-primary-600" : "bg-gray-200"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                preferences.newsletter ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>
      </div>

      {message && (
        <div
          className={`mt-4 p-3 rounded-lg ${
            message.includes("success")
              ? "bg-green-50 text-green-700"
              : "bg-red-50 text-red-700"
          }`}
        >
          {message}
        </div>
      )}

      <button
        onClick={handleSave}
        disabled={saving}
        className="mt-6 w-full bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition disabled:opacity-50"
      >
        {saving ? "Saving..." : "Save Preferences"}
      </button>
    </div>
  );
}
