// app/meetings/[id]/page.jsx
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Clock, Tag, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function MeetingDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [meeting, setMeeting] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMeeting = async () => {
      try {
        // Get JWT token from localStorage
        const token = localStorage.getItem('token') || localStorage.getItem('authToken');
        
        if (!token) {
          setError("Please login to view meetings");
          setLoading(false);
          return;
        }

        const res = await fetch(
          `http://localhost:8080/api/transcribe/meeting/${params.id}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          }
        );
        const data = await res.json();
        
        if (data.success) {
          setMeeting(data.meeting);
        } else {
          setError(data.error || "Failed to load meeting");
        }
      } catch (err) {
        console.error("Error fetching meeting:", err);
        setError("Failed to load meeting details");
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchMeeting();
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading meeting details...</p>
        </div>
      </div>
    );
  }

  if (error || !meeting) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 text-lg">{error || "Meeting not found"}</p>
          <Button onClick={() => router.push("/meetings")} className="mt-4">
            Back to Meetings
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => router.push("/meetings")}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Meetings
          </Button>
          
          <div className="bg-sidebar rounded-lg shadow-md p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {meeting.title}
                </h1>
                <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                  {meeting.label && (
                    <span className="flex items-center gap-1">
                      <Tag className="w-4 h-4" />
                      <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-xs font-medium">
                        {meeting.label}
                      </span>
                    </span>
                  )}
                  {meeting.time && (
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {meeting.time}
                    </span>
                  )}
                  {meeting.createdAt && (
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(meeting.createdAt).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
            </div>
            
            {/* Short Summary */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <h2 className="text-sm font-semibold text-blue-900 dark:text-blue-200 mb-2">
                Quick Summary
              </h2>
              <p className="text-gray-700 dark:text-gray-300">
                {meeting.shortSummary}
              </p>
            </div>
          </div>
        </div>

        {/* Full Summary */}
        <div className="bg-sidebar rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Full Summary
          </h2>
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
              {meeting.LongSummary}
            </p>
          </div>
        </div>

        {/* Full Transcript */}
        {meeting.transcript && (
          <div className="bg-sidebar rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Full Transcript
            </h2>
            <div className="prose dark:prose-invert max-w-none">
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap text-sm leading-relaxed">
                {meeting.transcript}
              </p>
            </div>
          </div>
        )}

        {/* User Info (if available) */}
        {meeting.user && (
          <div className="bg-sidebar rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Meeting Owner
            </h2>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
                {meeting.user.name?.[0] || meeting.user.email?.[0] || "U"}
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">
                  {meeting.user.name || "Unknown User"}
                </p>
                {meeting.user.email && (
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {meeting.user.email}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}