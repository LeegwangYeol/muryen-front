"use client";

import { useEffect, useState } from "react";
import { signIn, signOut, useSession } from "next-auth/react";

// 세션 타입 확장
interface CustomSession {
  user?: {
    email?: string | null;
  };
  accessToken?: string;
}

export default function YouTubeCommentPage() {
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [videoId, setVideoId] = useState(""); // 비디오 ID 입력을 위한 상태
  const [comment, setComment] = useState(""); // 댓글 내용 입력을 위한 상태

  const executeComment = async () => {
    const customSession = session as CustomSession;
    if (!customSession?.accessToken) {
      setError("Please authenticate first");
      return;
    }

    if (!videoId) {
      setError("Please enter a video ID");
      return;
    }

    if (!comment) {
      setError("Please enter a comment");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // 먼저 채널 ID 가져오기
      const userResponse = await fetch(
        "https://www.googleapis.com/youtube/v3/channels?part=id&mine=true",
        {
          headers: {
            Authorization: `Bearer ${customSession.accessToken}`,
          },
        }
      );

      if (!userResponse.ok) {
        throw new Error("Failed to get channel information");
      }

      const userData = await userResponse.json();
      const channelId = userData.items[0]?.id;

      if (!channelId) {
        throw new Error("Channel ID not found");
      }

      // 댓글 작성
      const response = await fetch(
        "https://www.googleapis.com/youtube/v3/commentThreads?part=snippet",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${customSession.accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            snippet: {
              videoId: videoId,
              topLevelComment: {
                snippet: {
                  textOriginal: comment,
                },
              },
            },
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || "Failed to post comment");
      }

      const data = await response.json();
      console.log("Comment posted:", data);
      setError(null);
      // 성공 후 입력 필드 초기화
      setComment("");
      setVideoId("");
    } catch (error: any) {
      setError("Failed to post comment: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">YouTube Comment Manager</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="space-y-4">
        {status === "loading" ? (
          <div>Loading...</div>
        ) : session ? (
          <>
            <div className="flex items-center space-x-4">
              <span>Signed in as {session.user?.email}</span>
              <button
                onClick={() => signOut()}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              >
                Sign Out
              </button>
            </div>

            <div className="space-y-2">
              <input
                type="text"
                value={videoId}
                onChange={(e) => setVideoId(e.target.value)}
                placeholder="Enter YouTube Video ID"
                className="w-full p-2 border rounded"
              />
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Enter your comment"
                className="w-full p-2 border rounded h-24"
              />
              <button
                onClick={executeComment}
                disabled={isLoading || !videoId || !comment}
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
              >
                {isLoading ? "Loading..." : "Post Comment"}
              </button>
            </div>
          </>
        ) : (
          <button
            onClick={() => signIn("google", { callbackUrl: "/test2" })}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Sign in with Google
          </button>
        )}
      </div>
    </div>
  );
}
