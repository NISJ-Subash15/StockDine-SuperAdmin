import React, { useEffect, useState } from 'react';
import { api } from '../lib/api';
import { Review } from '../types';
import { StatusBadge } from '../components/StatusBadge';
import { Star, Search, Filter, ShieldAlert, CheckCircle2, AlertOctagon, Trash2, X } from 'lucide-react';

export const ReviewsPage: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState('');
  const [ratingFilter, setRatingFilter] = useState<'All' | '5' | '4' | '3' | '2' | '1'>('All');

  // Moderation modal
  const [moderatingReview, setModeratingReview] = useState<Review | null>(null);
  const [moderationReason, setModerationReason] = useState('');

  useEffect(() => {
    async function loadReviews() {
      setIsLoading(true);
      const data = await api.getReviews();
      setReviews(data);
      setIsLoading(false);
    }
    loadReviews();
  }, []);

  const handleModerate = async (review: Review, action: 'Published' | 'Removed' | 'Flagged', reason?: string) => {
    await api.moderateReview(review.id, action, reason);
    setReviews((prev) =>
      prev.map((r) => (r.id === review.id ? { ...r, moderationStatus: action, moderationReason: reason } : r))
    );
    setModeratingReview(null);
    setModerationReason('');
  };

  const filteredReviews = reviews.filter((r) => {
    const matchesSearch =
      r.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.restaurantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.comment.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRating = ratingFilter === 'All' || r.rating === parseInt(ratingFilter, 10);
    return matchesSearch && matchesRating;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-widest">
            <Star className="size-4 text-[#D2D0C1]" />
            <span>Platform Review Moderation</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-foreground mt-1">
            Ratings & Spam Moderation Desk
          </h1>
        </div>
      </div>

      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-card p-4 rounded-2xl border border-border">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-3 size-4 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search review text, diner or venue..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-background border border-border text-xs font-semibold text-foreground focus:outline-none focus:border-[#D2D0C1]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="size-4 text-muted-foreground shrink-0" />
          <span className="text-xs font-bold text-muted-foreground">Rating:</span>
          {(['All', '5', '4', '3', '2', '1'] as const).map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRatingFilter(r)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                ratingFilter === r
                  ? 'bg-[#D2D0C1] text-[#2B2B2B]'
                  : 'bg-background text-muted-foreground hover:text-foreground border border-border'
              }`}
            >
              {r === 'All' ? 'All' : `${r}★`}
            </button>
          ))}
        </div>
      </div>

      {/* Reviews Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {isLoading ? (
          <div className="col-span-full p-12 text-center text-xs font-bold text-muted-foreground space-y-2">
            <div className="size-6 rounded-full border-2 border-[#D2D0C1] border-t-transparent animate-spin mx-auto" />
            <span>Loading platform reviews...</span>
          </div>
        ) : filteredReviews.length === 0 ? (
          <div className="col-span-full p-12 text-center text-xs font-semibold text-muted-foreground">
            No reviews found matching filter.
          </div>
        ) : (
          filteredReviews.map((rev) => (
            <div
              key={rev.id}
              className="p-5 rounded-3xl bg-card border border-border space-y-4 shadow-sm flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="font-bold text-foreground text-sm block">{rev.userName}</span>
                    <span className="text-xs text-muted-foreground block">{rev.restaurantName}</span>
                  </div>
                  <StatusBadge status={rev.moderationStatus} />
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`size-3.5 ${
                          i < rev.rating ? 'fill-[#D2D0C1] text-[#D2D0C1]' : 'text-muted-foreground/30'
                        }`}
                      />
                    ))}
                  </div>
                  {rev.isVerifiedBooking && (
                    <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <CheckCircle2 className="size-3" />
                      Verified Dining Booking
                    </span>
                  )}
                </div>

                <p className="text-xs text-foreground/90 font-medium leading-relaxed bg-background p-3 rounded-2xl border border-border">
                  "{rev.comment}"
                </p>

                {rev.moderationReason && (
                  <div className="text-[11px] text-rose-400 bg-rose-500/10 border border-rose-500/20 p-2.5 rounded-xl font-medium">
                    Reason for action: {rev.moderationReason}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-border text-xs">
                <span className="text-muted-foreground">{rev.date}</span>
                <div className="flex gap-2">
                  {rev.moderationStatus !== 'Published' && (
                    <button
                      type="button"
                      onClick={() => handleModerate(rev, 'Published')}
                      className="px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 border border-emerald-500/20 font-bold text-xs cursor-pointer"
                    >
                      Publish
                    </button>
                  )}
                  {rev.moderationStatus !== 'Removed' && (
                    <button
                      type="button"
                      onClick={() => setModeratingReview(rev)}
                      className="px-3 py-1.5 rounded-xl bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 border border-rose-500/20 font-bold text-xs cursor-pointer flex items-center gap-1"
                    >
                      <Trash2 className="size-3.5" />
                      <span>Remove Spam</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Moderation Modal */}
      {moderatingReview && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-serif font-bold text-xl text-foreground">
                Remove Review
              </h3>
              <button
                type="button"
                onClick={() => setModeratingReview(null)}
                className="p-1 rounded-lg text-muted-foreground hover:text-foreground"
              >
                <X className="size-5" />
              </button>
            </div>

            <p className="text-xs text-muted-foreground">
              Please enter the explicit moderation justification for removing <strong className="text-foreground">{moderatingReview.userName}</strong>'s review. Super Admin guidelines prohibit removing genuine diner feedback without a valid moderation reason.
            </p>

            <textarea
              rows={3}
              value={moderationReason}
              onChange={(e) => setModerationReason(e.target.value)}
              placeholder="e.g. Contains offensive language, spam links or fake non-verified review."
              className="w-full p-3 rounded-2xl bg-background border border-border text-xs font-semibold text-foreground focus:outline-none focus:border-[#D2D0C1]"
            />

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setModeratingReview(null)}
                className="w-1/2 py-3 rounded-2xl bg-muted text-xs font-bold text-foreground cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleModerate(moderatingReview, 'Removed', moderationReason)}
                className="w-1/2 py-3 rounded-2xl bg-rose-500 text-white font-extrabold text-xs uppercase cursor-pointer"
              >
                Remove Review
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
