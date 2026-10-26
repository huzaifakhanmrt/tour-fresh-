import React, { useState, useEffect } from 'react';
import { getReviews, saveReview, deleteReview, logAudit } from '../../services/db';
import { ReviewItem } from '../../types';
import { useAuth } from '../../context/AuthContext';

export const ReviewsScreen: React.FC = () => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Editor Modal
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingRev, setEditingRev] = useState<ReviewItem | null>(null);
  const [formName, setFormName] = useState('');
  const [formLocation, setFormLocation] = useState('');
  const [formRating, setFormRating] = useState<number>(5);
  const [formText, setFormText] = useState('');
  const [formTour, setFormTour] = useState('');
  const [formIsApproved, setFormIsApproved] = useState(true);

  useEffect(() => {
    loadReviews();
  }, []);

  async function loadReviews() {
    setIsLoading(true);
    try {
      const data = await getReviews(true);
      setReviews(data);
    } catch (err) {
      console.error('Failed to load reviews:', err);
    } finally {
      setIsLoading(false);
    }
  }

  const openNewReview = () => {
    setEditingRev(null);
    setFormName('VIP Guest');
    setFormLocation('Doha, Qatar');
    setFormRating(5);
    setFormText('Flawless chauffeur service and breathtaking Inland Sea sunset setup.');
    setFormTour('Khor Al Adaid Luxury Dune Bashing & Inland Sea Sunset');
    setFormIsApproved(true);
    setIsEditorOpen(true);
  };

  const openEditReview = (r: ReviewItem) => {
    setEditingRev(r);
    setFormName(r.name);
    setFormLocation(r.location);
    setFormRating(r.rating);
    setFormText(r.text);
    setFormTour(r.tour);
    setFormIsApproved(r.isApproved);
    setIsEditorOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const id = editingRev?.id || `rev-${Date.now().toString(36)}`;
      const payload: ReviewItem = {
        id,
        name: formName,
        location: formLocation,
        date: editingRev?.date || 'Just now',
        rating: Number(formRating),
        text: formText,
        tour: formTour,
        initials: formName
          .split(' ')
          .map((n) => n[0])
          .join('')
          .toUpperCase()
          .slice(0, 2),
        isApproved: formIsApproved,
        createdAt: editingRev?.createdAt || new Date().toISOString(),
      };

      await saveReview(payload);
      await logAudit(
        editingRev ? 'update_review' : 'create_review',
        user?.email || 'admin',
        `Review by ${payload.name}`
      );

      await loadReviews();
      setIsEditorOpen(false);
    } catch (err) {
      console.error('Failed to save review:', err);
    }
  };

  const handleToggleApprove = async (r: ReviewItem) => {
    try {
      await saveReview({ ...r, isApproved: !r.isApproved });
      await logAudit('moderate_review', user?.email || 'admin', `${r.id} approved: ${!r.isApproved}`);
      await loadReviews();
    } catch (err) {
      console.error('Approval toggle error:', err);
    }
  };

  const handleDelete = async (r: ReviewItem) => {
    if (!confirm(`Delete review from ${r.name}?`)) return;
    try {
      await deleteReview(r.id);
      await logAudit('delete_review', user?.email || 'admin', `Deleted review: ${r.id}`);
      await loadReviews();
    } catch (err) {
      console.error('Delete review error:', err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-white">
            Guest Reviews & Testimonials Moderation
          </h2>
          <p className="text-xs text-neutral-400">
            Approved testimonials automatically appear on the public homepage and experience detail modals.
          </p>
        </div>

        <button
          onClick={openNewReview}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#ecc15a] hover:bg-[#ffdf99] text-[#111317] font-bold text-xs uppercase tracking-wider transition-all shadow-lg active:scale-95 cursor-pointer shrink-0"
        >
          <span className="material-symbols-outlined text-[18px]">add_comment</span>
          <span>Add Guest Testimonial</span>
        </button>
      </div>

      {isLoading ? (
        <div className="py-20 text-center text-xs text-[#ecc15a]">
          Loading reviews from Firestore...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {reviews.map((r) => (
            <div
              key={r.id}
              className={`p-5 rounded-xl border flex flex-col justify-between space-y-3 transition-all ${
                r.isApproved
                  ? 'bg-[#111317] border-[#282a2e] hover:border-[#ecc15a]/40'
                  : 'bg-[#111317]/50 border-amber-800/40 opacity-80'
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-[#1e2024] border border-[#ecc15a]/30 flex items-center justify-center text-[#ecc15a] font-bold text-xs">
                      {r.initials || r.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-bold text-white text-xs">{r.name}</div>
                      <div className="text-[10px] text-neutral-400">{r.location}</div>
                    </div>
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      r.isApproved
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-600/40'
                        : 'bg-amber-950 text-amber-400 border border-amber-600/40'
                    }`}
                  >
                    {r.isApproved ? 'Approved' : 'Pending Review'}
                  </span>
                </div>

                {/* Rating stars */}
                <div className="flex items-center gap-1 mt-2 text-[#ecc15a]">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <span
                      key={idx}
                      className={`material-symbols-outlined text-[14px] ${
                        idx < r.rating ? 'fill-current' : 'text-neutral-600'
                      }`}
                    >
                      star
                    </span>
                  ))}
                  <span className="text-[11px] text-neutral-400 ml-1 font-mono">
                    {r.rating}.0
                  </span>
                </div>

                <p className="text-xs text-neutral-300 mt-2 italic leading-relaxed line-clamp-3">
                  "{r.text}"
                </p>

                <div className="text-[10px] text-[#ecc15a] font-medium mt-2 truncate">
                  Tour: {r.tour}
                </div>
              </div>

              <div className="pt-3 border-t border-[#282a2e] flex items-center justify-between text-xs">
                <button
                  onClick={() => handleToggleApprove(r)}
                  className={`text-[11px] font-bold uppercase transition-colors ${
                    r.isApproved ? 'text-amber-400 hover:text-amber-300' : 'text-emerald-400 hover:text-emerald-300'
                  }`}
                >
                  {r.isApproved ? 'Unpublish' : 'Approve for Web'}
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEditReview(r)}
                    className="p-1 rounded text-neutral-400 hover:text-white"
                  >
                    <span className="material-symbols-outlined text-[16px]">edit</span>
                  </button>
                  <button
                    onClick={() => handleDelete(r)}
                    className="p-1 rounded text-neutral-400 hover:text-red-400"
                  >
                    <span className="material-symbols-outlined text-[16px]">delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isEditorOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsEditorOpen(false)} />
          <div className="relative w-full max-w-md bg-[#111317] border border-[#ecc15a]/40 rounded-2xl p-6 z-10 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#282a2e]">
              <h3 className="font-serif font-bold text-white text-base">
                {editingRev ? 'Edit Testimonial' : 'New Guest Testimonial'}
              </h3>
              <button onClick={() => setIsEditorOpen(false)} className="text-neutral-400 hover:text-white">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block text-neutral-400 mb-1">Guest Full Name *</label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full bg-[#1e2024] border border-[#282a2e] rounded-lg px-3 py-2 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-400 mb-1">Location / Country</label>
                  <input
                    type="text"
                    value={formLocation}
                    onChange={(e) => setFormLocation(e.target.value)}
                    className="w-full bg-[#1e2024] border border-[#282a2e] rounded-lg px-3 py-2 text-white"
                    placeholder="London, UK"
                  />
                </div>

                <div>
                  <label className="block text-neutral-400 mb-1">Star Rating (1-5)</label>
                  <input
                    type="number"
                    min={1}
                    max={5}
                    value={formRating}
                    onChange={(e) => setFormRating(Number(e.target.value))}
                    className="w-full bg-[#1e2024] border border-[#282a2e] rounded-lg px-3 py-2 text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-neutral-400 mb-1">Experience Name</label>
                <input
                  type="text"
                  value={formTour}
                  onChange={(e) => setFormTour(e.target.value)}
                  className="w-full bg-[#1e2024] border border-[#282a2e] rounded-lg px-3 py-2 text-white"
                  placeholder="Khor Al Adaid Luxury Dune Bashing"
                />
              </div>

              <div>
                <label className="block text-neutral-400 mb-1">Review Feedback Text *</label>
                <textarea
                  rows={3}
                  required
                  value={formText}
                  onChange={(e) => setFormText(e.target.value)}
                  className="w-full bg-[#1e2024] border border-[#282a2e] rounded-lg px-3 py-2 text-white"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="approveRev"
                  checked={formIsApproved}
                  onChange={(e) => setFormIsApproved(e.target.checked)}
                  className="rounded accent-[#ecc15a]"
                />
                <label htmlFor="approveRev" className="text-neutral-300 cursor-pointer">
                  Approved & Visible on Website
                </label>
              </div>

              <div className="pt-3 border-t border-[#282a2e] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditorOpen(false)}
                  className="px-4 py-2 rounded-lg bg-[#1e2024] text-neutral-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-[#ecc15a] text-[#111317] font-bold uppercase tracking-wider"
                >
                  Save Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
