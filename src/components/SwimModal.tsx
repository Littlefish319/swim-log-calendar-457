import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { STROKES, SwimLog } from '../types';

interface SwimModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (log: Omit<SwimLog, 'id'>) => void;
  initialDate?: string;
}

export function SwimModal({ isOpen, onClose, onSave, initialDate }: SwimModalProps) {
  const [date, setDate] = useState(initialDate || new Date().toISOString().split('T')[0]);
  const [distance, setDistance] = useState('');
  const [unit, setUnit] = useState<'m' | 'yd'>('m');
  const [stroke, setStroke] = useState(STROKES[0]);
  const [duration, setDuration] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (isOpen && initialDate) {
      setDate(initialDate);
    }
  }, [isOpen, initialDate]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      date,
      distance: Number(distance),
      unit,
      stroke,
      duration,
      notes
    });
    // Reset form
    setDistance('');
    setDuration('');
    setNotes('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b p-4">
          <h2 className="text-xl font-semibold text-slate-800">Log Swim</h2>
          <button onClick={onClose} className="rounded-full p-1 hover:bg-slate-100">
            <X className="h-5 w-5 text-slate-500" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700">Date</label>
            <input 
              type="date" 
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 shadow-sm focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700">Distance</label>
              <div className="relative mt-1">
                <input 
                  type="number" 
                  required
                  min="0"
                  value={distance}
                  onChange={(e) => setDistance(e.target.value)}
                  className="block w-full rounded-md border border-slate-300 px-3 py-2 shadow-sm focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                  placeholder="0"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Unit</label>
              <select 
                value={unit}
                onChange={(e) => setUnit(e.target.value as 'm' | 'yd')}
                className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 shadow-sm focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
              >
                <option value="m">Meters</option>
                <option value="yd">Yards</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">Stroke</label>
            <select 
              value={stroke}
              onChange={(e) => setStroke(e.target.value)}
              className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 shadow-sm focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
            >
              {STROKES.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">Duration (optional)</label>
            <input 
              type="text" 
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="e.g. 45:00"
              className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 shadow-sm focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">Notes</label>
            <textarea 
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 shadow-sm focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
            />
          </div>

          <button 
            type="submit"
            className="w-full rounded-md bg-cyan-600 px-4 py-2 text-white hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2"
          >
            Save Swim
          </button>
        </form>
      </div>
    </div>
  );
}