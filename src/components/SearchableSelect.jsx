import { useEffect, useRef, useState } from 'react'
import { ChevronDown, Search } from './icons'

export default function SearchableSelect({ value, onChange, options, placeholder = 'Select an option', ariaLabel, className = '' }) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const wrapperRef = useRef(null)
  const searchRef = useRef(null)
  const selectedOption = options.find((option) => option.value === value)
  const filteredOptions = options.filter((option) => option.label.toLowerCase().includes(query.trim().toLowerCase()))

  useEffect(() => {
    const closeOnOutsideClick = (event) => {
      if (!wrapperRef.current?.contains(event.target)) setOpen(false)
    }
    document.addEventListener('pointerdown', closeOnOutsideClick)
    return () => document.removeEventListener('pointerdown', closeOnOutsideClick)
  }, [])

  useEffect(() => {
    if (open) window.setTimeout(() => searchRef.current?.focus(), 0)
  }, [open])

  const selectOption = (option) => {
    onChange(option.value)
    setQuery('')
    setOpen(false)
  }

  const handleKeyDown = (event) => {
    if (event.key === 'Escape') {
      setOpen(false)
      return
    }
    if (event.key === 'Enter' && filteredOptions[0]) {
      event.preventDefault()
      selectOption(filteredOptions[0])
    }
  }

  return <div className={`searchable-select ${open ? 'is-open' : ''} ${className}`} ref={wrapperRef}>
    <button type="button" className="searchable-select-trigger" aria-haspopup="listbox" aria-expanded={open} aria-label={ariaLabel} onClick={() => setOpen((current) => !current)}>
      <span className={selectedOption ? '' : 'placeholder'}>{selectedOption?.label || placeholder}</span>
      <ChevronDown size={14} />
    </button>
    {open && <div className="searchable-select-menu" role="listbox">
      <div className="searchable-select-search"><Search size={14} /><input ref={searchRef} value={query} onChange={(event) => setQuery(event.target.value)} onKeyDown={handleKeyDown} placeholder="Search options" aria-label="Search options" /></div>
      <div className="searchable-select-options">
        {filteredOptions.length ? filteredOptions.map((option) => <button type="button" role="option" aria-selected={option.value === value} className={option.value === value ? 'selected' : ''} key={option.value} onClick={() => selectOption(option)}>{option.label}</button>) : <span className="searchable-select-empty">No options found</span>}
      </div>
    </div>}
  </div>
}
