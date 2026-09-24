"use client";

import { motion } from "framer-motion";
import {
  Mail,
  MessageSquare,
  UserRound,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { JobComment } from "@/features/cs/types/job-details.types";

interface ActivityTimelineProps {
  comments: JobComment[];
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(date));
}

export function ActivityTimeline({
  comments,
}: ActivityTimelineProps) {
  if (comments.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Activity
          </CardTitle>
        </CardHeader>

        <CardContent>
          <p className="text-sm text-muted-foreground">
            No comments or activity recorded yet.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Activity
        </CardTitle>

        <p className="text-sm text-muted-foreground">
          Comments and notes recorded during this job
        </p>
      </CardHeader>

      <CardContent>
        <div className="relative">
          {comments.map((comment, index) => {
            const isLast = index === comments.length - 1;

            return (
              <motion.div
                key={comment.id}
                initial={{
                  opacity: 0,
                  x: -8,
                }}
                animate={{
                  opacity: 1,
                  x: 0,
                }}
                transition={{
                  duration: 0.25,
                  delay: index * 0.05,
                  ease: "easeOut",
                }}
                className="relative flex gap-4"
              >
                {!isLast && (
                  <div className="absolute left-[11px] top-7 h-[calc(100%-4px)] w-px bg-border" />
                )}

                {/* Timeline indicator */}
                <div className="relative z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border bg-background">
                  <MessageSquare className="h-3.5 w-3.5 text-primary" />
                </div>

                {/* Comment */}
                <div className="min-w-0 flex-1 pb-7">
                  <div className="flex flex-col gap-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-sm font-semibold">
                        {comment.user.name}
                      </h3>

                      <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                        {comment.user.userType ===
                        "employee"
                          ? "Employee"
                          : "Customer"}
                      </span>
                    </div>

                    <p className="text-xs text-muted-foreground">
                      {formatDate(comment.createdAt)}
                    </p>
                  </div>

                  {/* User email */}
                  <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                    <Mail className="h-3.5 w-3.5 shrink-0" />

                    <span className="break-all">
                      {comment.user.email}
                    </span>
                  </div>

                  {/* Comment text */}
                  <div className="mt-3 rounded-md bg-muted/50 px-3 py-2.5">
                    <p className="whitespace-pre-wrap text-sm leading-relaxed">
                      {comment.comment}
                    </p>
                  </div>

                  {/* Target */}
                  {comment.jobItemId && (
                    <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                      <UserRound className="h-3.5 w-3.5" />

                      <span>
                        Related to repair item
                      </span>
                    </div>
                  )}

                  {comment.jobId && !comment.jobItemId && (
                    <div className="mt-2 text-xs text-muted-foreground">
                      Job-level comment
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}