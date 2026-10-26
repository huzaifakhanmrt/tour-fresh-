import React, { useState, useEffect } from 'react';
import { getExperiences, saveExperience, deleteExperience, duplicateExperience, logAudit } from '../../services/db';
import { Tour, ExperienceCategory } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { MediaUploader, GalleryUploader } from '../components/MediaUploader';

export const ExperiencesScreen: React.FC = () => {
  const { user } = useAuth();
  const [experiences, setExperiences] = useState<Tour[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Modal editor state
  const [isEditorOpen, setIsEditorOpen] = useState<boolean>(false);
  const [editingTour, setEditingTour] = useState<Tour | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [previewTour, setPreviewTour] = useState<Tour | null>(null);

  // Form field state
  const [formTitle, setFormTitle] = useState('');
  const [formSubtitle, setFormSubtitle] = useState('');
  const [formCategory, setFormCategory] = useState<ExperienceCategory>('desert');
  const [formCategoryLabel, setFormCategoryLabel] = useState('');
  const [formDuration, setFormDuration] = useState('');
  const [formLocation, setFormLocation] = useState('');
  const [formBasePriceQar, setFormBasePriceQar] = useState<number>(450);
  const [formChildPriceQar, setFormChildPriceQar] = useState<number>(250);
  const [formInfantPriceQar, setFormInfantPriceQar] = useState<number>(0);
  const [formPrivateBooking, setFormPrivateBooking] = useState<boolean>(true);
  const [formGroupBooking, setFormGroupBooking] = useState<boolean>(true);
  const [formMinGuests, setFormMinGuests] = useState<number>(1);
  const [formMaxGuests, setFormMaxGuests] = useState<number>(12);
  const [formBadge, setFormBadge] = useState('');
  const [formImage, setFormImage] = useState('');
  const [formGallery, setFormGallery] = useState<string[]>([]);
  const [formShortDescription, setFormShortDescription] = useState('');
  const [formFullDescription, setFormFullDescription] = useState('');
  const [formVehicle, setFormVehicle] = useState('');
  const [formAmenitiesText, setFormAmenitiesText] = useState('');
  const [formHighlightsText, setFormHighlightsText] = useState('');
  const [formIncludedText, setFormIncludedText] = useState('');
  const [formNotIncludedText, setFormNotIncludedText] = useState('');
  const [formTimeSlotsText, setFormTimeSlotsText] = useState('');
  const [formPickupOptionsText, setFormPickupOptionsText] = useState('');
  const [formCancellationPolicy, setFormCancellationPolicy] = useState('');
  const [formSeoTitle, setFormSeoTitle] = useState('');
  const [formSeoDescription, setFormSeoDescription] = useState('');
  const [formStatus, setFormStatus] = useState<'published' | 'draft' | 'archived'>('published');

  // Itinerary items list
  const [itineraryItems, setItineraryItems] = useState<{ time: string; title: string; description: string }[]>([]);

  useEffect(() => {
    loadTours();
  }, []);

  async function loadTours() {
    setIsLoading(true);
    try {
      const data = await getExperiences(true);
      setExperiences(data);
    } catch (err) {
      console.error('Failed to load experiences:', err);
    } finally {
      setIsLoading(false);
    }
  }

  const categoryOptions: { id: ExperienceCategory | 'all'; label: string }[] = [
    { id: 'all', label: 'All Experiences' },
    { id: 'desert', label: 'Desert Safari & Dunes' },
    { id: 'sea', label: 'Sea & Dhow Cruises' },
    { id: 'culture', label: 'Culture & Doha Heritage' },
    { id: 'vip', label: 'VIP Luxury Charters' },
    { id: 'airport_transfers', label: 'Airport Transfers' },
    { id: 'hotel_transfers', label: 'Hotel Transfers' },
    { id: 'resort_stays', label: 'Resort Stays' },
    { id: 'horse_riding', label: 'Arabian Horse Riding' },
    { id: 'parties', label: 'Private Parties & Yacht Events' },
    { id: 'desert_tents', label: 'Desert Tent & Majlis' },
    { id: 'saudi_trips', label: 'Saudi Arabia Cross-Border' },
    { id: 'bahrain_trips', label: 'Bahrain Maritime Trips' },
    { id: 'gcc_trips', label: 'GCC Regional Tours' },
  ];

  const openNewExperienceModal = () => {
    setEditingTour(null);
    setFormTitle('');
    setFormSubtitle('');
    setFormCategory('desert');
    setFormCategoryLabel('Desert Safari & Dunes');
    setFormDuration('4 - 6 Hours');
    setFormLocation('Sealine • Khor Al Adaid');
    setFormBasePriceQar(450);
    setFormChildPriceQar(250);
    setFormInfantPriceQar(0);
    setFormPrivateBooking(true);
    setFormGroupBooking(true);
    setFormMinGuests(1);
    setFormMaxGuests(6);
    setFormBadge('New VIP');
    setFormImage('https://images.unsplash.com/photo-1547234935-80c7145ec969?auto=format&fit=crop&w=1200&q=80');
    setFormImage('');
    setFormGallery([]);
    setFormShortDescription('Experience the dramatic Arabian dunes and sunset over the inland sea.');
    setFormFullDescription('A bespoke expedition taking guests into the desert heart of Qatar with private chauffeurs.');
    setFormVehicle('Private Toyota Land Cruiser V8 4x4');
    setFormAmenitiesText('4x4 Transport, Mineral Water, Karak Tea, Falcon Greeting');
    setFormHighlightsText('UNESCO Inland sea\nProfessional dune bashing\nSunset photography stop');
    setFormIncludedText('Hotel pickup & drop-off\nDesert safari certified guide\nChilled beverages');
    setFormNotIncludedText('Personal souvenir purchases\nGratuities');
    setFormTimeSlotsText('09:00 Morning, 14:30 Sunset Golden Hour');
    setFormPickupOptionsText('Hamad Airport, West Bay Hotels, The Pearl-Qatar');
    setFormCancellationPolicy('Free cancellation up to 24 hours prior to departure.');
    setFormSeoTitle('Luxury Desert Safari in Doha, Qatar | MZ Tourism');
    setFormSeoDescription('Book private desert safaris in Qatar with 4x4 dune bashing and inland sea views.');
    setFormStatus('published');
    setItineraryItems([
      { time: '14:00', title: 'Hotel Chauffeur Pickup', description: 'Doorstep pickup in luxury 4x4.' },
      { time: '15:30', title: 'Dune Traversal & Sandboarding', description: 'Thrilling traversal across dunes.' },
      { time: '17:30', title: 'Sunset at Khor Al Adaid', description: 'Scenic golden hour stop beside the sea.' },
    ]);
    setIsEditorOpen(true);
  };

  const openEditModal = (tour: Tour) => {
    setEditingTour(tour);
    setFormTitle(tour.title || '');
    setFormSubtitle(tour.subtitle || '');
    setFormCategory(tour.category || 'desert');
    setFormCategoryLabel(tour.categoryLabel || 'Experience');
    setFormDuration(tour.duration || '4 Hours');
    setFormLocation(tour.location || 'Doha, Qatar');
    setFormBasePriceQar(tour.basePriceQar || 350);
    setFormChildPriceQar(tour.childPriceQar ?? Math.round((tour.basePriceQar || 350) * 0.6));
    setFormInfantPriceQar(tour.infantPriceQar ?? 0);
    setFormPrivateBooking(tour.privateBookingAllowed ?? true);
    setFormGroupBooking(tour.groupBookingAllowed ?? true);
    setFormMinGuests(tour.minGuests || 1);
    setFormMaxGuests(tour.maxGuests || 12);
    setFormBadge(tour.badge || '');
    setFormImage(tour.image || '');
    setFormGallery(tour.gallery || []);
    setFormShortDescription(tour.shortDescription || '');
    setFormFullDescription(tour.fullDescription || '');
    setFormVehicle(tour.vehicle || 'Luxury Chauffeur Vehicle');
    setFormAmenitiesText(tour.amenities ? tour.amenities.join(', ') : '');
    setFormHighlightsText(tour.highlights ? tour.highlights.join('\n') : '');
    setFormIncludedText(tour.included ? tour.included.join('\n') : '');
    setFormNotIncludedText(tour.notIncluded ? tour.notIncluded.join('\n') : '');
    setFormTimeSlotsText(tour.timeSlots ? tour.timeSlots.join(', ') : 'Morning, Afternoon, Sunset');
    setFormPickupOptionsText(tour.pickupDropoffOptions ? tour.pickupDropoffOptions.join(', ') : 'All Doha Locations');
    setFormCancellationPolicy(tour.cancellationPolicy || 'Free cancellation up to 24h prior.');
    setFormSeoTitle(tour.seoTitle || tour.title);
    setFormSeoDescription(tour.seoDescription || tour.shortDescription);
    setFormStatus(tour.status || 'published');
    setItineraryItems(tour.itinerary || []);
    setIsEditorOpen(true);
  };

  const handleSaveExperience = async (e?: React.FormEvent, overrideStatus?: 'published' | 'draft') => {
    if (e) e.preventDefault();
    if (!formTitle.trim()) {
      alert('Please enter an experience title.');
      return;
    }
    if (!formImage.trim()) {
      alert('Please upload or set a cover image.');
      return;
    }

    setIsSaving(true);
    const finalStatus = overrideStatus || formStatus;
    try {
      const tourId = editingTour?.id || `exp-${Date.now().toString(36)}`;
      const amenities = formAmenitiesText
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
      const highlights = formHighlightsText
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean);
      const included = formIncludedText
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean);
      const notIncluded = formNotIncludedText
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean);
      const timeSlots = formTimeSlotsText
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
      const pickupDropoffOptions = formPickupOptionsText
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      const payload: Tour = {
        id: tourId,
        title: formTitle,
        subtitle: formSubtitle,
        category: formCategory,
        categoryLabel: formCategoryLabel || formCategory.replace('_', ' ').toUpperCase(),
        duration: formDuration,
        rating: editingTour?.rating || 5.0,
        reviewsCount: editingTour?.reviewsCount || 1,
        location: formLocation,
        basePriceQar: Number(formBasePriceQar),
        childPriceQar: Number(formChildPriceQar),
        infantPriceQar: Number(formInfantPriceQar),
        privateBookingAllowed: formPrivateBooking,
        groupBookingAllowed: formGroupBooking,
        minGuests: Number(formMinGuests),
        maxGuests: Number(formMaxGuests),
        badge: formBadge,
        image: formImage,
        gallery: formGallery,
        shortDescription: formShortDescription,
        fullDescription: formFullDescription,
        vehicle: formVehicle,
        amenities,
        highlights,
        included,
        notIncluded,
        itinerary: itineraryItems,
        timeSlots,
        pickupDropoffOptions,
        cancellationPolicy: formCancellationPolicy,
        seoTitle: formSeoTitle,
        seoDescription: formSeoDescription,
        status: finalStatus,
        publishedAt: finalStatus === 'published' ? new Date().toISOString() : editingTour?.publishedAt,
        publishedBy: finalStatus === 'published' ? (user?.email || 'admin') : editingTour?.publishedBy,
        createdAt: editingTour?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await saveExperience(payload);
      await logAudit(
        editingTour ? 'update_experience' : 'create_experience',
        user?.email || 'admin',
        `Experience: ${formTitle} (${tourId}) - ${finalStatus}`
      );

      setToastMessage({
        type: 'success',
        text: `Experience "${formTitle}" successfully ${finalStatus === 'published' ? 'published to live site!' : 'saved as draft!'}`,
      });

      await loadTours();
      setIsEditorOpen(false);
    } catch (err: any) {
      console.error('Error saving experience:', err);
      setToastMessage({ type: 'error', text: `Failed to save: ${err.message || 'Unknown error'}` });
    } finally {
      setIsSaving(false);
    }
  };

  const handleTogglePublish = async (tour: Tour) => {
    const nextStatus = tour.status === 'published' ? 'draft' : 'published';
    try {
      await saveExperience({
        ...tour,
        status: nextStatus,
        publishedAt: nextStatus === 'published' ? new Date().toISOString() : tour.publishedAt,
        publishedBy: nextStatus === 'published' ? (user?.email || 'admin') : tour.publishedBy,
      });
      await logAudit(
        nextStatus === 'published' ? 'publish_experience' : 'unpublish_experience',
        user?.email || 'admin',
        `${tour.title} set to ${nextStatus}`
      );
      setToastMessage({
        type: 'success',
        text: `"${tour.title}" is now ${nextStatus === 'published' ? 'PUBLISHED on live website' : 'set to DRAFT (hidden)'}.`,
      });
      await loadTours();
    } catch (err: any) {
      setToastMessage({ type: 'error', text: `Failed to update status: ${err.message}` });
    }
  };

  const handleDuplicate = async (tour: Tour) => {
    if (!confirm(`Duplicate "${tour.title}"?`)) return;
    try {
      await duplicateExperience(tour);
      await logAudit('duplicate_experience', user?.email || 'admin', `Duplicated ${tour.title}`);
      await loadTours();
      setToastMessage({ type: 'success', text: `Duplicated "${tour.title}" as draft.` });
    } catch (err: any) {
      setToastMessage({ type: 'error', text: `Failed to duplicate: ${err.message}` });
    }
  };

  const handleDelete = async (tour: Tour) => {
    if (!confirm(`Are you sure you want to permanently delete "${tour.title}"?`)) return;
    try {
      await deleteExperience(tour.id);
      await logAudit('delete_experience', user?.email || 'admin', `Deleted ${tour.title} (${tour.id})`);
      await loadTours();
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  // Filtered experiences
  const filtered = experiences.filter((tour) => {
    const matchCat = selectedCategory === 'all' || tour.category === selectedCategory;
    const matchSearch =
      tour.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tour.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tour.shortDescription?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-white">
            Curated Experiences & Tours
          </h2>
          <p className="text-xs text-neutral-400">
            Publish, edit pricing, manage itineraries, and configure Qatar & GCC luxury tours.
          </p>
        </div>

        <button
          onClick={openNewExperienceModal}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#ecc15a] hover:bg-[#ffdf99] text-[#111317] font-bold text-xs uppercase tracking-wider transition-all shadow-lg active:scale-95 cursor-pointer shrink-0"
        >
          <span className="material-symbols-outlined text-[18px]">add_circle</span>
          <span>Create New Experience</span>
        </button>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div
          className={`p-3.5 rounded-xl flex items-center justify-between gap-3 text-xs shadow-lg animate-in fade-in ${
            toastMessage.type === 'success'
              ? 'bg-emerald-950/80 border border-emerald-500/50 text-emerald-200'
              : 'bg-red-950/80 border border-red-500/50 text-red-200'
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">
              {toastMessage.type === 'success' ? 'check_circle' : 'error'}
            </span>
            <span className="font-medium">{toastMessage.text}</span>
          </div>
          <button
            onClick={() => setToastMessage(null)}
            className="text-neutral-400 hover:text-white cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">close</span>
          </button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-[#111317] p-3 rounded-xl border border-[#282a2e]">
        {/* Category Pills / Select */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-[#1e2024] text-xs text-white border border-[#282a2e] rounded-lg px-3 py-2 focus:border-[#ecc15a] outline-none"
          >
            {categoryOptions.map((opt) => (
              <option key={opt.id} value={opt.id}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Search */}
        <div className="relative min-w-[240px]">
          <span className="material-symbols-outlined absolute left-3 top-2.5 text-neutral-500 text-[18px]">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search experiences..."
            className="w-full bg-[#1e2024] border border-[#282a2e] text-xs text-white rounded-lg pl-9 pr-3 py-2 focus:border-[#ecc15a] outline-none placeholder:text-neutral-500"
          />
        </div>
      </div>

      {/* Experiences Grid */}
      {isLoading ? (
        <div className="py-20 text-center text-xs text-[#ecc15a]">
          Loading experiences from Firestore...
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-[#111317] border border-[#282a2e] p-12 text-center rounded-xl space-y-3">
          <span className="material-symbols-outlined text-4xl text-neutral-600">travel_explore</span>
          <div className="text-white font-medium text-sm">No experiences found</div>
          <p className="text-xs text-neutral-400">
            Try switching category filters or click "Create New Experience" to add a tour.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((tour) => {
            const isPub = tour.status === 'published';
            return (
              <div
                key={tour.id}
                className="bg-[#111317] border border-[#282a2e] rounded-xl overflow-hidden flex flex-col hover:border-[#ecc15a]/40 transition-colors group"
              >
                {/* Image & Status Badge */}
                <div className="relative h-44 bg-[#1e2024] overflow-hidden">
                  <img
                    src={tour.image}
                    alt={tour.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1547234935-80c7145ec969?auto=format&fit=crop&w=800&q=80';
                    }}
                  />
                  <div className="absolute top-3 left-3 flex gap-2">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        isPub
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-600/50'
                          : 'bg-amber-950 text-amber-300 border border-amber-600/50'
                      }`}
                    >
                      {tour.status || 'published'}
                    </span>
                    {tour.badge && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#ecc15a] text-[#111317]">
                        {tour.badge}
                      </span>
                    )}
                  </div>
                  <div className="absolute bottom-2 right-2 px-2 py-1 rounded bg-black/80 backdrop-blur-md text-[#ecc15a] font-mono text-xs font-bold">
                    {tour.basePriceQar} QAR
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-[#ecc15a] font-semibold">
                      {tour.categoryLabel || tour.category}
                    </div>
                    <h3 className="font-serif font-bold text-white text-base leading-snug line-clamp-2 mt-0.5">
                      {tour.title}
                    </h3>
                    <p className="text-xs text-neutral-400 line-clamp-2 mt-1">
                      {tour.shortDescription}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-[#282a2e] text-[11px] text-neutral-400 flex items-center justify-between">
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">schedule</span>
                      {tour.duration}
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">location_on</span>
                      {tour.location?.split('•')[0]}
                    </span>
                  </div>

                  {/* Actions Bar */}
                  <div className="pt-2 border-t border-[#282a2e] flex items-center justify-between gap-1">
                    <button
                      onClick={() => openEditModal(tour)}
                      className="flex-1 py-1.5 rounded bg-[#1e2024] hover:bg-[#282a2e] text-white text-xs font-medium border border-[#282a2e] hover:border-[#ecc15a]/40 transition-colors flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[14px] text-[#ecc15a]">edit</span>
                      <span>Edit</span>
                    </button>

                    <button
                      onClick={() => handleTogglePublish(tour)}
                      title={isPub ? 'Unpublish to Draft (Hide from public)' : 'Publish to Live Website'}
                      className={`p-1.5 rounded border transition-colors cursor-pointer ${
                        isPub
                          ? 'bg-emerald-950/40 text-emerald-400 border-emerald-600/40 hover:bg-amber-950/40 hover:text-amber-400'
                          : 'bg-amber-950/40 text-amber-400 border-amber-600/40 hover:bg-emerald-950/40 hover:text-emerald-400'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[16px]">
                        {isPub ? 'visibility_off' : 'visibility'}
                      </span>
                    </button>

                    <button
                      onClick={() => handleDuplicate(tour)}
                      title="Duplicate Tour"
                      className="p-1.5 rounded bg-[#1e2024] hover:bg-[#282a2e] text-neutral-300 hover:text-white border border-[#282a2e] transition-colors cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[16px]">content_copy</span>
                    </button>

                    <button
                      onClick={() => handleDelete(tour)}
                      title="Delete Tour"
                      className="p-1.5 rounded bg-[#1e2024] hover:bg-red-950/60 text-neutral-400 hover:text-red-400 border border-[#282a2e] hover:border-red-700/40 transition-colors cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[16px]">delete</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal Editor */}
      {isEditorOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div
            className="fixed inset-0 bg-black/85 backdrop-blur-md"
            onClick={() => !isSaving && setIsEditorOpen(false)}
          />
          <div className="relative w-full max-w-4xl bg-[#111317] border border-[#ecc15a]/30 rounded-2xl shadow-2xl z-10 max-h-[90vh] flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="p-5 border-b border-[#282a2e] flex items-center justify-between bg-[#16181d]">
              <div>
                <h3 className="font-serif font-bold text-lg text-white">
                  {editingTour ? `Edit Experience: ${editingTour.title}` : 'Create New Luxury Experience'}
                </h3>
                <p className="text-xs text-[#ecc15a]">
                  Changes are stored persistently in Cloud Firestore.
                </p>
              </div>
              <button
                onClick={() => setIsEditorOpen(false)}
                disabled={isSaving}
                className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-[#282a2e]"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Modal Body Form */}
            <form onSubmit={handleSaveExperience} className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
              {/* Basic Information */}
              <div className="space-y-4">
                <div className="font-bold uppercase tracking-wider text-[#ecc15a] text-[11px] pb-1 border-b border-[#282a2e]">
                  1. Title, Classification & Pricing
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-neutral-400 mb-1">Experience Title *</label>
                    <input
                      type="text"
                      required
                      value={formTitle}
                      onChange={(e) => setFormTitle(e.target.value)}
                      className="w-full bg-[#1e2024] border border-[#282a2e] rounded-lg px-3 py-2 text-white focus:border-[#ecc15a] outline-none"
                      placeholder="e.g. Khor Al Adaid Sunset Safari"
                    />
                  </div>

                  <div>
                    <label className="block text-neutral-400 mb-1">Subtitle / Headline</label>
                    <input
                      type="text"
                      value={formSubtitle}
                      onChange={(e) => setFormSubtitle(e.target.value)}
                      className="w-full bg-[#1e2024] border border-[#282a2e] rounded-lg px-3 py-2 text-white focus:border-[#ecc15a] outline-none"
                      placeholder="e.g. Golden dunes meeting deep blue Arabian waters"
                    />
                  </div>

                  <div>
                    <label className="block text-neutral-400 mb-1">Category *</label>
                    <select
                      value={formCategory}
                      onChange={(e) => {
                        setFormCategory(e.target.value as ExperienceCategory);
                        const match = categoryOptions.find((c) => c.id === e.target.value);
                        if (match) setFormCategoryLabel(match.label);
                      }}
                      className="w-full bg-[#1e2024] border border-[#282a2e] rounded-lg px-3 py-2 text-white focus:border-[#ecc15a] outline-none"
                    >
                      {categoryOptions
                        .filter((c) => c.id !== 'all')
                        .map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.label}
                          </option>
                        ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-neutral-400 mb-1">Display Label</label>
                    <input
                      type="text"
                      value={formCategoryLabel}
                      onChange={(e) => setFormCategoryLabel(e.target.value)}
                      className="w-full bg-[#1e2024] border border-[#282a2e] rounded-lg px-3 py-2 text-white focus:border-[#ecc15a] outline-none"
                      placeholder="e.g. Desert Safari & Dunes"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-neutral-400 mb-1">Adult Price (QAR) *</label>
                    <input
                      type="number"
                      required
                      min={0}
                      value={formBasePriceQar}
                      onChange={(e) => setFormBasePriceQar(Number(e.target.value))}
                      className="w-full bg-[#1e2024] border border-[#282a2e] rounded-lg px-3 py-2 text-white font-mono focus:border-[#ecc15a] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-400 mb-1">Child Price (QAR)</label>
                    <input
                      type="number"
                      min={0}
                      value={formChildPriceQar}
                      onChange={(e) => setFormChildPriceQar(Number(e.target.value))}
                      className="w-full bg-[#1e2024] border border-[#282a2e] rounded-lg px-3 py-2 text-white font-mono focus:border-[#ecc15a] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-400 mb-1">Infant Price (QAR)</label>
                    <input
                      type="number"
                      min={0}
                      value={formInfantPriceQar}
                      onChange={(e) => setFormInfantPriceQar(Number(e.target.value))}
                      className="w-full bg-[#1e2024] border border-[#282a2e] rounded-lg px-3 py-2 text-white font-mono focus:border-[#ecc15a] outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-neutral-400 mb-1">Duration</label>
                    <input
                      type="text"
                      value={formDuration}
                      onChange={(e) => setFormDuration(e.target.value)}
                      className="w-full bg-[#1e2024] border border-[#282a2e] rounded-lg px-3 py-2 text-white focus:border-[#ecc15a] outline-none"
                      placeholder="e.g. 4 - 6 Hours"
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-400 mb-1">Location / Destination</label>
                    <input
                      type="text"
                      value={formLocation}
                      onChange={(e) => setFormLocation(e.target.value)}
                      className="w-full bg-[#1e2024] border border-[#282a2e] rounded-lg px-3 py-2 text-white focus:border-[#ecc15a] outline-none"
                      placeholder="e.g. Khor Al Adaid • Sealine"
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-400 mb-1">Promo Badge</label>
                    <input
                      type="text"
                      value={formBadge}
                      onChange={(e) => setFormBadge(e.target.value)}
                      className="w-full bg-[#1e2024] border border-[#282a2e] rounded-lg px-3 py-2 text-white focus:border-[#ecc15a] outline-none"
                      placeholder="e.g. Most Popular or VIP Royal"
                    />
                  </div>
                </div>
              </div>

              {/* Media & Descriptions */}
              <div className="space-y-4">
                <div className="font-bold uppercase tracking-wider text-[#ecc15a] text-[11px] pb-1 border-b border-[#282a2e]">
                  2. Imagery & Descriptions
                </div>

                <div className="space-y-4">
                  <MediaUploader
                    label="Primary Cover Image *"
                    value={formImage}
                    onChange={(url) => setFormImage(url)}
                    aspectRatio="landscape"
                    category="experience"
                    helperText="Upload cover photo from your computer (auto-optimized) or choose from library."
                  />

                  <GalleryUploader
                    label="Experience Gallery Photos"
                    images={formGallery}
                    onChange={(imgs) => setFormGallery(imgs)}
                  />
                </div>

                <div>
                  <label className="block text-neutral-400 mb-1">Short Description (Cards & Previews)</label>
                  <textarea
                    rows={2}
                    value={formShortDescription}
                    onChange={(e) => setFormShortDescription(e.target.value)}
                    className="w-full bg-[#1e2024] border border-[#282a2e] rounded-lg px-3 py-2 text-white focus:border-[#ecc15a] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-neutral-400 mb-1">Full Detailed Itinerary Description</label>
                  <textarea
                    rows={4}
                    value={formFullDescription}
                    onChange={(e) => setFormFullDescription(e.target.value)}
                    className="w-full bg-[#1e2024] border border-[#282a2e] rounded-lg px-3 py-2 text-white focus:border-[#ecc15a] outline-none"
                  />
                </div>
              </div>

              {/* Fleet & Amenities */}
              <div className="space-y-4">
                <div className="font-bold uppercase tracking-wider text-[#ecc15a] text-[11px] pb-1 border-b border-[#282a2e]">
                  3. Fleet, Capacities & Amenities
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-neutral-400 mb-1">Vehicle Specification</label>
                    <input
                      type="text"
                      value={formVehicle}
                      onChange={(e) => setFormVehicle(e.target.value)}
                      className="w-full bg-[#1e2024] border border-[#282a2e] rounded-lg px-3 py-2 text-white focus:border-[#ecc15a] outline-none"
                      placeholder="e.g. Private Toyota Land Cruiser V8 / Nissan Patrol"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-neutral-400 mb-1">Min Guests</label>
                      <input
                        type="number"
                        min={1}
                        value={formMinGuests}
                        onChange={(e) => setFormMinGuests(Number(e.target.value))}
                        className="w-full bg-[#1e2024] border border-[#282a2e] rounded-lg px-3 py-2 text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-neutral-400 mb-1">Max Guests</label>
                      <input
                        type="number"
                        min={1}
                        value={formMaxGuests}
                        onChange={(e) => setFormMaxGuests(Number(e.target.value))}
                        className="w-full bg-[#1e2024] border border-[#282a2e] rounded-lg px-3 py-2 text-white font-mono"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-neutral-400 mb-1">Amenities (comma-separated)</label>
                  <input
                    type="text"
                    value={formAmenitiesText}
                    onChange={(e) => setFormAmenitiesText(e.target.value)}
                    className="w-full bg-[#1e2024] border border-[#282a2e] rounded-lg px-3 py-2 text-white focus:border-[#ecc15a] outline-none"
                    placeholder="4x4 Private Car, Camel Ride, Dinner Included, Gahwa & Dates"
                  />
                </div>

                <div>
                  <label className="block text-neutral-400 mb-1">Key Highlights (one per line)</label>
                  <textarea
                    rows={3}
                    value={formHighlightsText}
                    onChange={(e) => setFormHighlightsText(e.target.value)}
                    className="w-full bg-[#1e2024] border border-[#282a2e] rounded-lg px-3 py-2 text-white focus:border-[#ecc15a] outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-neutral-400 mb-1">What's Included (one per line)</label>
                    <textarea
                      rows={3}
                      value={formIncludedText}
                      onChange={(e) => setFormIncludedText(e.target.value)}
                      className="w-full bg-[#1e2024] border border-[#282a2e] rounded-lg px-3 py-2 text-white focus:border-[#ecc15a] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-400 mb-1">What's Not Included (one per line)</label>
                    <textarea
                      rows={3}
                      value={formNotIncludedText}
                      onChange={(e) => setFormNotIncludedText(e.target.value)}
                      className="w-full bg-[#1e2024] border border-[#282a2e] rounded-lg px-3 py-2 text-white focus:border-[#ecc15a] outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Status and SEO */}
              <div className="space-y-4">
                <div className="font-bold uppercase tracking-wider text-[#ecc15a] text-[11px] pb-1 border-b border-[#282a2e]">
                  4. Publication Status & Policy
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-neutral-400 mb-1">Publication State</label>
                    <select
                      value={formStatus}
                      onChange={(e) => setFormStatus(e.target.value as any)}
                      className="w-full bg-[#1e2024] border border-[#282a2e] rounded-lg px-3 py-2 text-white font-bold focus:border-[#ecc15a] outline-none"
                    >
                      <option value="published">Published (Visible on Website)</option>
                      <option value="draft">Draft (Hidden from Public)</option>
                      <option value="archived">Archived</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-neutral-400 mb-1">Cancellation Policy</label>
                    <input
                      type="text"
                      value={formCancellationPolicy}
                      onChange={(e) => setFormCancellationPolicy(e.target.value)}
                      className="w-full bg-[#1e2024] border border-[#282a2e] rounded-lg px-3 py-2 text-white focus:border-[#ecc15a] outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Modal Action Buttons */}
              <div className="pt-4 border-t border-[#282a2e] flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-neutral-400">Current Status:</span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                      formStatus === 'published'
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-600/50'
                        : formStatus === 'draft'
                        ? 'bg-amber-950 text-amber-300 border border-amber-600/50'
                        : 'bg-neutral-800 text-neutral-400 border border-neutral-700'
                    }`}
                  >
                    {formStatus}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm('Discard unsaved changes?')) {
                        setIsEditorOpen(false);
                      }
                    }}
                    disabled={isSaving}
                    className="px-4 py-2.5 rounded-lg bg-[#1e2024] hover:bg-[#282a2e] text-neutral-300 font-semibold text-xs uppercase tracking-wider cursor-pointer"
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSaveExperience(undefined, 'draft')}
                    disabled={isSaving}
                    className="px-5 py-2.5 rounded-lg bg-[#282a2e] hover:bg-[#34373d] text-amber-300 border border-amber-500/40 font-bold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-md disabled:opacity-50 inline-flex items-center gap-1.5"
                  >
                    <span className="material-symbols-outlined text-[16px]">edit_note</span>
                    <span>Save Draft (Hidden)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSaveExperience(undefined, 'published')}
                    disabled={isSaving}
                    className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-[#ecc15a] to-[#c29b38] hover:opacity-90 text-[#111317] font-bold text-xs uppercase tracking-wider shadow-lg active:scale-95 disabled:opacity-50 cursor-pointer inline-flex items-center gap-1.5"
                  >
                    <span className="material-symbols-outlined text-[16px]">publish</span>
                    <span>{isSaving ? 'Publishing...' : 'Publish to Live Site'}</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
