import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  User, 
  Crown, 
  Sparkles, 
  Gift, 
  Ticket, 
  Heart, 
  ShieldCheck, 
  Key, 
  Eye, 
  EyeOff, 
  Check, 
  Copy, 
  Popcorn, 
  Armchair, 
  Tv, 
  ArrowRight,
  Award,
  CreditCard
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { loyaltyApi, userProfileApi } from '../services/api';
import { LoyaltyProfile, RewardItem } from '../types';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const { user, login } = useAuth();
  
  const [loyalty, setLoyalty] = useState<LoyaltyProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'rewards' | 'settings' | 'security'>('rewards');

  // Edit profile state
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || '');
  const [savingProfile, setSavingProfile] = useState(false);

  // Change password state
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showOldPass, setShowOldPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [changingPass, setChangingPass] = useState(false);

  // Voucher modal state
  const [redeemedVoucher, setRedeemedVoucher] = useState<{ title: string; code: string } | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const data = await loyaltyApi.getProfile();
      setLoyalty(data);
      if (user) {
        setFullName(user.fullName || '');
        setPhoneNumber(user.phoneNumber || '');
      }
    } catch {
      toast.error('Failed to load profile details');
    } finally {
      setLoading(false);
    }
  };

  const handleRedeem = async (reward: RewardItem) => {
    if (!loyalty) return;
    if (loyalty.points < reward.pointsCost) {
      toast.error(`You need ${reward.pointsCost - loyalty.points} more CinePoints for this reward!`);
      return;
    }

    try {
      const res = await loyaltyApi.redeem(reward.id);
      setRedeemedVoucher({
        title: reward.title,
        code: res.voucherCode || reward.voucherCode
      });
      // update state points
      setLoyalty(prev => prev ? {
        ...prev,
        points: res.remainingPoints ?? (prev.points - reward.pointsCost)
      } : null);
      toast.success(`Redeemed: ${reward.title}! 🎉`);
    } catch (err: any) {
      toast.error(err.message || 'Redemption failed');
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;
    setSavingProfile(true);
    try {
      await userProfileApi.update(user.id, {
        fullName,
        phoneNumber
      });
      toast.success('Profile details updated successfully!');
    } catch {
      toast.error('Failed to update profile.');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match!');
      return;
    }
    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters long.');
      return;
    }

    setChangingPass(true);
    try {
      await userProfileApi.changePassword({
        oldPassword,
        newPassword
      });
      toast.success('Password changed successfully! 🔐');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to change password');
    } finally {
      setChangingPass(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(true);
    toast.success('Voucher code copied to clipboard!');
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const getTierGradient = (tier?: string) => {
    switch (tier) {
      case 'PLATINUM':
        return 'from-rose-600 via-purple-700 to-indigo-800';
      case 'GOLD':
        return 'from-amber-600 via-amber-500 to-yellow-400';
      default:
        return 'from-slate-700 via-slate-600 to-zinc-500';
    }
  };

  const getRewardIcon = (iconName?: string) => {
    switch (iconName) {
      case 'Popcorn':
        return <Popcorn className="w-5 h-5 text-amber-400" />;
      case 'Armchair':
        return <Armchair className="w-5 h-5 text-rose-400" />;
      case 'Tv':
        return <Tv className="w-5 h-5 text-cyan-400" />;
      default:
        return <Ticket className="w-5 h-5 text-emerald-400" />;
    }
  };

  return (
    <div className="min-h-screen pb-28 pt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Top Header Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Holographic VIP CineClub Membership Pass */}
          <div className="lg:col-span-5">
            <div className={`relative rounded-3xl p-7 text-white shadow-2xl overflow-hidden bg-gradient-to-br ${getTierGradient(loyalty?.currentTier)} border border-white/20 transform hover:scale-[1.02] transition-transform duration-500`}>
              
              {/* Shimmer Ambient Sheen */}
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/30 via-transparent to-black/30 pointer-events-none" />
              
              <div className="relative z-10 space-y-8">
                
                {/* Brand & Chip */}
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xl font-black font-['Outfit'] tracking-wider">NEXURA</span>
                    <span className="block text-[9px] uppercase tracking-[0.25em] text-white/80 font-bold -mt-1">CineClub VIP</span>
                  </div>
                  <div className="w-10 h-7 rounded-md bg-gradient-to-tr from-amber-200 to-amber-400 border border-amber-100 flex items-center justify-center shadow-inner">
                    <div className="w-6 h-4 border border-amber-600/50 rounded-sm" />
                  </div>
                </div>

                {/* Points & Tier Badge */}
                <div className="space-y-1">
                  <span className="text-[10px] uppercase tracking-widest text-white/80 font-semibold">Available Balance</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-black font-['Outfit']">{loyalty?.points ?? 250}</span>
                    <span className="text-xs font-bold text-amber-200 uppercase tracking-wider">CinePoints</span>
                  </div>
                </div>

                {/* Member Name & Status */}
                <div className="flex items-center justify-between pt-2 border-t border-white/20 text-xs">
                  <div>
                    <span className="block text-[9px] text-white/70 uppercase font-semibold">Cardholder</span>
                    <span className="font-bold truncate max-w-[180px] block">{loyalty?.userFullName || user?.fullName || 'Valued Member'}</span>
                  </div>
                  <div className="text-right">
                    <span className="block text-[9px] text-white/70 uppercase font-semibold">Tier Status</span>
                    <span className="font-black tracking-wider uppercase bg-white/20 px-2 py-0.5 rounded-full text-[10px] backdrop-blur-sm">
                      {loyalty?.currentTier || 'SILVER'} VIP
                    </span>
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* Quick Metrics & Tier Progress */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold">
                <Crown className="w-3.5 h-3.5" />
                <span>CineClub Rewards Loyalty Tier</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-white font-['Outfit']">
                Welcome, <span className="bg-gradient-to-r from-rose-500 to-amber-400 bg-clip-text text-transparent">{user?.fullName?.split(' ')[0] || 'Member'}</span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-300">
                You enjoy <strong className="text-amber-400">{loyalty?.discountPercentage || 5}% Off</strong> on all concession snacks and movie bookings as a {loyalty?.currentTier} member.
              </p>
            </div>

            {/* Progress Bar towards Next Tier */}
            <div className="p-5 rounded-2xl glass-panel border border-slate-800 space-y-2.5">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-slate-300">Next VIP Tier Progress:</span>
                <span className="text-amber-400 font-bold">{loyalty?.points ?? 250} / {loyalty?.nextTierPoints ?? 500} Pts</span>
              </div>
              <div className="w-full h-3 rounded-full bg-slate-900 border border-slate-800 overflow-hidden p-0.5">
                <div 
                  className="h-full rounded-full bg-gradient-to-r from-rose-600 via-amber-500 to-amber-400 transition-all duration-700 shadow-lg shadow-amber-500/30"
                  style={{ width: `${Math.min(100, loyalty?.progressPercentage ?? 50)}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-400">
                Earn 10 CinePoints for every LKR 100 spent on movie tickets and snacks.
              </p>
            </div>

            {/* Quick Action Navigation Buttons */}
            <div className="flex flex-wrap items-center gap-3">
              <Link
                to="/my-bookings"
                className="px-4 py-2.5 rounded-xl glass-panel hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-white flex items-center gap-2 transition-all"
              >
                <Ticket className="w-4 h-4 text-rose-400" />
                <span>My Movie Tickets</span>
              </Link>
              <Link
                to="/watchlist"
                className="px-4 py-2.5 rounded-xl glass-panel hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-white flex items-center gap-2 transition-all"
              >
                <Heart className="w-4 h-4 text-rose-400" />
                <span>Saved Watchlist</span>
              </Link>
            </div>

          </div>

        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 gap-6 text-sm font-semibold">
          <button
            onClick={() => setActiveTab('rewards')}
            className={`pb-3 border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'rewards'
                ? 'border-rose-500 text-rose-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Gift className="w-4 h-4" />
            <span>Redeem Rewards Marketplace</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`pb-3 border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'settings'
                ? 'border-rose-500 text-rose-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Account Details</span>
          </button>

          <button
            onClick={() => setActiveTab('security')}
            className={`pb-3 border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'security'
                ? 'border-rose-500 text-rose-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Security & Password</span>
          </button>
        </div>

        {/* TAB 1: REWARDS MARKETPLACE */}
        {activeTab === 'rewards' && (
          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-black text-white font-['Outfit']">Instant CineClub Rewards</h3>
              <p className="text-xs text-slate-400 mt-1">
                Redeem your points anytime for complimentary food, seating upgrades, or movie ticket discounts.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {(loyalty?.availableRewards || []).map((reward) => {
                const canAfford = (loyalty?.points ?? 0) >= reward.pointsCost;
                return (
                  <div
                    key={reward.id}
                    className="p-6 rounded-3xl glass-card border border-slate-800 flex flex-col justify-between space-y-5"
                  >
                    <div className="space-y-3">
                      <div className="w-10 h-10 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center">
                        {getRewardIcon(reward.iconName)}
                      </div>
                      <h4 className="text-base font-bold text-white font-['Outfit']">{reward.title}</h4>
                      <p className="text-xs text-slate-400 leading-relaxed">{reward.description}</p>
                    </div>

                    <div className="pt-4 border-t border-slate-800/80 space-y-3">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-400">Required:</span>
                        <span className="font-bold text-amber-400">{reward.pointsCost} CinePoints</span>
                      </div>

                      <button
                        onClick={() => handleRedeem(reward)}
                        disabled={!canAfford}
                        className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                          canAfford
                            ? 'bg-gradient-to-r from-rose-600 to-amber-500 hover:from-rose-500 hover:to-amber-400 text-white shadow-lg shadow-rose-600/30'
                            : 'bg-slate-800/60 text-slate-500 cursor-not-allowed border border-slate-800'
                        }`}
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>{canAfford ? 'Redeem Voucher' : 'Need More Points'}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* VIP Tier Benefits List */}
            <div className="p-7 rounded-3xl glass-panel border border-slate-800 space-y-4 mt-8">
              <h4 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-400" /> Your Current Tier Perks ({loyalty?.currentTier || 'SILVER'} VIP)
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {(loyalty?.tierBenefits || []).map((benefit, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-200">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ACCOUNT SETTINGS */}
        {activeTab === 'settings' && (
          <div className="max-w-xl p-8 rounded-3xl glass-panel border border-slate-800 space-y-6">
            <div>
              <h3 className="text-lg font-bold text-white font-['Outfit']">Profile Information</h3>
              <p className="text-xs text-slate-400 mt-1">Update your display name and contact phone number.</p>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Full Name</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full glass-input rounded-xl px-4 py-2.5 text-xs text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Email Address (Immutable)</label>
                <input
                  type="email"
                  disabled
                  value={user?.email || ''}
                  className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-500 cursor-not-allowed"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Phone Number</label>
                <input
                  type="tel"
                  placeholder="+94 77 123 4567"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full glass-input rounded-xl px-4 py-2.5 text-xs text-white"
                />
              </div>

              <button
                type="submit"
                disabled={savingProfile}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-amber-500 hover:from-rose-500 text-white text-xs font-bold transition-all shadow-md cursor-pointer disabled:opacity-50"
              >
                {savingProfile ? 'Saving...' : 'Save Profile Changes'}
              </button>
            </form>
          </div>
        )}

        {/* TAB 3: SECURITY & PASSWORD */}
        {activeTab === 'security' && (
          <div className="max-w-xl p-8 rounded-3xl glass-panel border border-slate-800 space-y-6">
            <div>
              <h3 className="text-lg font-bold text-white font-['Outfit']">Change Password</h3>
              <p className="text-xs text-slate-400 mt-1">Ensure your account is protected with a secure password.</p>
            </div>

            <form onSubmit={handleChangePassword} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Current Password</label>
                <div className="relative">
                  <input
                    type={showOldPass ? 'text' : 'password'}
                    required
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    className="w-full glass-input rounded-xl px-4 py-2.5 pr-10 text-xs text-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowOldPass(!showOldPass)}
                    className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-300"
                  >
                    {showOldPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">New Password</label>
                <div className="relative">
                  <input
                    type={showNewPass ? 'text' : 'password'}
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full glass-input rounded-xl px-4 py-2.5 pr-10 text-xs text-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPass(!showNewPass)}
                    className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-300"
                  >
                    {showNewPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Confirm New Password</label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full glass-input rounded-xl px-4 py-2.5 text-xs text-white"
                />
              </div>

              <button
                type="submit"
                disabled={changingPass}
                className="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all shadow-md cursor-pointer disabled:opacity-50"
              >
                {changingPass ? 'Updating...' : 'Update Password'}
              </button>
            </form>
          </div>
        )}

      </div>

      {/* Redeemed Voucher Modal */}
      {redeemedVoucher && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-md p-7 rounded-3xl glass-panel border border-amber-500/40 space-y-6 text-center shadow-2xl">
            <div className="w-16 h-16 mx-auto rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Gift className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest">Reward Unlocked</span>
              <h3 className="text-2xl font-black text-white font-['Outfit']">{redeemedVoucher.title}</h3>
              <p className="text-xs text-slate-300">
                Present this digital voucher code at the candy counter or apply it at checkout:
              </p>
            </div>

            {/* Voucher Code Box */}
            <div className="p-4 rounded-2xl bg-black/60 border border-amber-500/40 flex items-center justify-between">
              <span className="text-lg font-black text-amber-400 font-mono tracking-wider">
                {redeemedVoucher.code}
              </span>
              <button
                onClick={() => copyToClipboard(redeemedVoucher.code)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                title="Copy Code"
              >
                {copiedCode ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            <button
              onClick={() => setRedeemedVoucher(null)}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-rose-600 to-amber-500 text-white text-xs font-bold shadow-lg"
            >
              Done & Return
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
