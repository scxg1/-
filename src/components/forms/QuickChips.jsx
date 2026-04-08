import { STORE_SUGGESTIONS } from '../../constants'

/**
 * Quick selection chips for store suggestions.
 * @param {{ onSelect: function, suggestions?: string[] }} props
 */
export function QuickChips({ onSelect, suggestions = STORE_SUGGESTIONS }) {
    return (
        <div className="flex flex-wrap gap-2">
            {suggestions.map((s) => (
                <button
                    key={s}
                    type="button"
                    onClick={() => onSelect(s)}
                    className="px-3 py-1.5 rounded-full bg-gold/10 text-gold text-xs hover:bg-gold/20 transition"
                >
                    {s}
                </button>
            ))}
        </div>
    )
}