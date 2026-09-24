import { US_STATES } from '../../utils/address.js'
import './AddressFields.css'

// Street / city / state / ZIP inputs for a US mailing address. Each field is
// wrapped in `fieldClassName` so it picks up the host form's own field styles.
export default function AddressFields({ idPrefix, value, onChange, fieldClassName = '', stacked = false }) {
  function update(field, fieldValue) {
    onChange({ ...value, [field]: fieldValue })
  }

  return (
    <div className={`address-fields${stacked ? ' address-fields--stacked' : ''}`}>
      <div className={`${fieldClassName} address-street`}>
        <label htmlFor={`${idPrefix}-street`}>Street address</label>
        <input
          id={`${idPrefix}-street`}
          type="text"
          autoComplete="address-line1"
          placeholder="123 Main Street, Apt 4"
          value={value.street}
          onChange={(e) => update('street', e.target.value)}
        />
      </div>

      <div className={`${fieldClassName} address-city`}>
        <label htmlFor={`${idPrefix}-city`}>City</label>
        <input
          id={`${idPrefix}-city`}
          type="text"
          autoComplete="address-level2"
          value={value.city}
          onChange={(e) => update('city', e.target.value)}
        />
      </div>

      <div className={`${fieldClassName} address-state`}>
        <label htmlFor={`${idPrefix}-state`}>State</label>
        <select
          id={`${idPrefix}-state`}
          autoComplete="address-level1"
          value={value.state}
          onChange={(e) => update('state', e.target.value)}
        >
          <option value="">Select</option>
          {US_STATES.map((state) => (
            <option key={state.code} value={state.code}>
              {state.code} — {state.name}
            </option>
          ))}
        </select>
      </div>

      <div className={`${fieldClassName} address-zip`}>
        <label htmlFor={`${idPrefix}-zip`}>ZIP code</label>
        <input
          id={`${idPrefix}-zip`}
          type="text"
          inputMode="numeric"
          autoComplete="postal-code"
          maxLength={10}
          placeholder="75205"
          value={value.zip}
          onChange={(e) => update('zip', e.target.value)}
        />
      </div>
    </div>
  )
}
