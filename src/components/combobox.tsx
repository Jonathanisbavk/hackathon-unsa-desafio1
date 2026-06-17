"use client";

import { useEffect, useRef, useState } from "react";

interface ComboboxProps {
  value: string;
  onChange: (value: string) => void;
  options: readonly string[];
  placeholder?: string;
  /** Permite escribir un valor que no está en la lista (ej: empresa). */
  allowFreeText?: boolean;
  id?: string;
  ariaLabel?: string;
}

/**
 * Combobox accesible: input con filtrado por texto y dropdown.
 * Resuelve "escribir y no estar deslizando" para carrera, ubicación y empresa.
 */
export default function Combobox({
  value,
  onChange,
  options,
  placeholder,
  allowFreeText = false,
  id,
  ariaLabel,
}: ComboboxProps) {
  const [open, setOpen] = useState(false);
  const [hi, setHi] = useState(0); // índice resaltado
  const ref = useRef<HTMLDivElement>(null);
  const listId = id ? `${id}-list` : undefined;

  const filtradas = options.filter((o) =>
    o.toLowerCase().includes(value.trim().toLowerCase()),
  );

  // Cerrar al hacer clic fuera.
  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  function seleccionar(opcion: string) {
    onChange(opcion);
    setOpen(false);
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (!open && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
      setOpen(true);
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHi((h) => Math.min(h + 1, filtradas.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHi((h) => Math.max(h - 1, 0));
    } else if (e.key === "Enter") {
      if (open && filtradas[hi]) {
        e.preventDefault();
        seleccionar(filtradas[hi]);
      }
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  return (
    <div ref={ref} className="relative">
      <input
        id={id}
        type="text"
        role="combobox"
        aria-expanded={open}
        aria-controls={listId}
        aria-autocomplete="list"
        aria-label={ariaLabel}
        autoComplete="off"
        value={value}
        placeholder={placeholder}
        onChange={(e) => {
          onChange(e.target.value);
          setOpen(true);
          setHi(0);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={onKeyDown}
        className="w-full rounded-lg border border-zinc-300 bg-zinc-50 px-3 py-2 pr-8 text-sm outline-none transition focus:border-unsa-primary focus:bg-white focus:ring-2 focus:ring-unsa-primary/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
      />
      {value && (
        <button
          type="button"
          aria-label="Limpiar"
          onClick={() => {
            onChange("");
            setOpen(false);
          }}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
        >
          ×
        </button>
      )}

      {open && (filtradas.length > 0 || (allowFreeText && value)) && (
        <ul
          role="listbox"
          id={listId}
          className="absolute z-30 mt-1 max-h-56 w-full overflow-auto rounded-lg border border-zinc-200 bg-white py-1 shadow-lg dark:border-zinc-700 dark:bg-zinc-800"
        >
          {filtradas.length === 0 && allowFreeText && value ? (
            <li
              role="option"
              aria-selected
              onMouseDown={(e) => {
                e.preventDefault();
                seleccionar(value);
              }}
              className="cursor-pointer px-3 py-2 text-sm text-zinc-600 hover:bg-unsa-primary/10 dark:text-zinc-300 dark:hover:bg-unsa-primary-light/20 dark:hover:text-unsa-primary-light"
            >
              Usar &ldquo;{value}&rdquo;
            </li>
          ) : (
            filtradas.map((o, i) => (
              <li
                key={o}
                role="option"
                aria-selected={i === hi}
                onMouseEnter={() => setHi(i)}
                onMouseDown={(e) => {
                  e.preventDefault();
                  seleccionar(o);
                }}
                className={`cursor-pointer px-3 py-2 text-sm ${
                  i === hi
                    ? "bg-unsa-primary/10 text-unsa-primary dark:bg-unsa-primary-light/20 dark:text-unsa-primary-light"
                    : "text-zinc-700 dark:text-zinc-200"
                }`}
              >
                {o}
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}
