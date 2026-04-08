import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, Package, Navigation, X } from 'lucide-react'
import { Button } from '../ui/Button'
import { Spinner } from '../ui/Spinner'

/**
 * Address Selection Modal - allows selecting pickup/delivery locations
 */
export function AddressSelectionModal({
    isOpen,
    onClose,
    pickupLocation,
    deliveryLocation,
    onSelectPickup,
    onSelectDelivery,
    onConfirm
}) {
    const [selectedLocation, setSelectedLocation] = useState(null)

    if (!isOpen) return null

    const handlePickupClick = () => {
        if (selectedLocation) {
            onSelectPickup(selectedLocation)
        }
    }

    const handleDeliveryClick = () => {
        if (selectedLocation) {
            onSelectDelivery(selectedLocation)
        }
    }

    const handleConfirm = () => {
        if (pickupLocation && deliveryLocation) {
            onConfirm()
        }
    }

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            >
                <motion.div
                    initial={{ y: '100%' }}
                    animate={{ y: 0 }}
                    exit={{ y: '100%' }}
                    transition={{ type: 'spring', damping: 25 }}
                    className="w-full max-w-lg bg-[var(--bg-surface)] rounded-t-3xl p-6"
                    onClick={e => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold text-[var(--text-primary)]">اختر العنوان</h3>
                        <button onClick={onClose} className="p-2 rounded-full hover:bg-[var(--bg-elevated)]">
                            <X size={20} className="text-[var(--text-muted)]" />
                        </button>
                    </div>

                    {/* Selected location info */}
                    {selectedLocation && (
                        <div className="mb-4 p-4 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)]">
                            <div className="flex items-start gap-3">
                                <MapPin className="text-gold mt-1" size={20} />
                                <div>
                                    <p className="font-bold text-[var(--text-primary)]">{selectedLocation.name || 'موقع مخصص'}</p>
                                    <p className="text-sm text-[var(--text-muted)]">{selectedLocation.address}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Action buttons */}
                    <div className="space-y-3">
                        <button
                            onClick={handlePickupClick}
                            disabled={!selectedLocation}
                            className="w-full py-4 px-4 rounded-xl bg-gold/10 border border-gold/30 text-gold font-bold flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gold/20 transition"
                        >
                            <Package size={20} />
                            استلام من هذا العنوان
                        </button>

                        <button
                            onClick={handleDeliveryClick}
                            disabled={!selectedLocation}
                            className="w-full py-4 px-4 rounded-xl bg-gold/10 border border-gold/30 text-gold font-bold flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gold/20 transition"
                        >
                            <Navigation size={20} />
                            توصيل إلى هذا العنوان
                        </button>
                    </div>

                    {/* Selected addresses summary */}
                    {(pickupLocation || deliveryLocation) && (
                        <div className="mt-6 pt-4 border-t border-[var(--border-subtle)]">
                            <p className="text-sm text-[var(--text-muted)] mb-3">العناوين المحددة:</p>

                            {pickupLocation && (
                                <div className="flex items-center gap-2 mb-2 text-sm">
                                    <span className="w-6 h-6 rounded-full bg-gold/20 text-gold flex items-center justify-center text-xs font-bold">A</span>
                                    <span className="text-[var(--text-primary)]">{pickupLocation.address}</span>
                                </div>
                            )}

                            {deliveryLocation && (
                                <div className="flex items-center gap-2 text-sm">
                                    <span className="w-6 h-6 rounded-full bg-gold/20 text-gold flex items-center justify-center text-xs font-bold">B</span>
                                    <span className="text-[var(--text-primary)]">{deliveryLocation.address}</span>
                                </div>
                            )}

                            {pickupLocation && deliveryLocation && (
                                <Button
                                    onClick={handleConfirm}
                                    fullWidth
                                    className="mt-4"
                                >
                                    تأكيد والمتابعة
                                </Button>
                            )}
                        </div>
                    )}
                </motion.div>
            </motion.div>
        </AnimatePresence>
    )
}