import { useState, useEffect, useMemo } from 'react';
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  startOfWeek,
  endOfWeek,
  isToday
} from 'date-fns';
import { ChevronLeft, ChevronRight, Plus, Waves, Trophy, Calendar as CalendarIcon, Trash2 } from 'lucide-react';
import { SwimModal } from './components/SwimModal';
import { SwimLog } from './types';
import { cn } from './lib/utils';

function App() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [logs, setLogs] = useState<SwimLog[]>(() => {
    const saved = localStorage.getItem('swimLogs');
    return saved ? JSON.parse(saved) : [];
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('swimLogs', JSON.stringify(logs));
  }, [logs]);

  const handleAddLog = (newLog: Omit<SwimLog, 'id'>) => {
    const log: SwimLog = {
      ...newLog,
      id: crypto.randomUUID()
    };
    setLogs([...logs, log]);
  };

  const handleDeleteLog = (id: string) => {
    setLogs(logs.filter(l => l.id !== id));
  };

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);

  const calendarDays = eachDayOfInterval({
    start: calendarStart,
    end: calendarEnd
  });

  const selectedDateLogs = logs.filter(log => isSameDay(new Date(log.date), selectedDate));
  
  const monthStats = useMemo(() => {
    const thisMonthLogs = logs.filter(log => isSameMonth(new Date(log.date), currentDate));
    const totalDistance = thisMonthLogs.reduce((acc, curr) => acc + curr.distance, 0);
    const totalSwims = thisMonthLogs.length;
    return { totalDistance, totalSwims };
  }, [logs, currentDate]);

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="mx-auto max-w-5xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-cyan-100 p-2">
                <Waves className="h-6 w-6 text-cyan-600" />
              </div>
              <h1 className="text-xl font-bold text-slate-900">SwimLog</h1>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 rounded-full bg-cyan-600 px-4 py-2 text-sm font-medium text-white hover:bg-cyan-700 transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Log Swim</span>
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Stats Cards */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-xl bg-white p-6 shadow-sm border border-slate-100">
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-blue-100 p-3">
                <Trophy className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">Total Distance ({format(currentDate, 'MMM')})</p>
                <p className="text-2xl font-bold text-slate-900">{monthStats.totalDistance.toLocaleString()} m</p>
              </div>
            </div>
          </div>
          <div className="rounded-xl bg-white p-6 shadow-sm border border-slate-100">
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-emerald-100 p-3">
                <CalendarIcon className="h-6 w-6 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">Sessions ({format(currentDate, 'MMM')})</p>
                <p className="text-2xl font-bold text-slate-900">{monthStats.totalSwims}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Calendar Section */}
          <div className="lg:col-span-2">
            <div className="rounded-xl bg-white shadow-sm border border-slate-100 overflow-hidden">
              <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
                <h2 className="text-lg font-semibold text-slate-900">
                  {format(currentDate, 'MMMM yyyy')}
                </h2>
                <div className="flex gap-1">
                  <button onClick={prevMonth} className="rounded-full p-1 hover:bg-slate-100">
                    <ChevronLeft className="h-5 w-5 text-slate-600" />
                  </button>
                  <button onClick={nextMonth} className="rounded-full p-1 hover:bg-slate-100">
                    <ChevronRight className="h-5 w-5 text-slate-600" />
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-7 border-b border-slate-100 bg-slate-50 text-center text-xs font-semibold leading-6 text-slate-500">
                <div className="py-2">S</div>
                <div className="py-2">M</div>
                <div className="py-2">T</div>
                <div className="py-2">W</div>
                <div className="py-2">T</div>
                <div className="py-2">F</div>
                <div className="py-2">S</div>
              </div>
              
              <div className="grid grid-cols-7 text-sm">
                {calendarDays.map((day, dayIdx) => {
                  const dayLogs = logs.filter(l => isSameDay(new Date(l.date), day));
                  const hasSwim = dayLogs.length > 0;
                  const isSelected = isSameDay(day, selectedDate);
                  const isCurrentMonth = isSameMonth(day, currentDate);

                  return (
                    <div 
                      key={day.toString()} 
                      className={cn(
                        "relative h-24 sm:h-32 border-b border-r border-slate-100 p-2 transition-colors hover:bg-slate-50 cursor-pointer",
                        !isCurrentMonth && "bg-slate-50/50 text-slate-400",
                        isSelected && "bg-cyan-50 hover:bg-cyan-50 ring-1 ring-inset ring-cyan-500"
                      )}
                      onClick={() => setSelectedDate(day)}
                    >
                      <time 
                        dateTime={format(day, 'yyyy-MM-dd')} 
                        className={cn(
                          "flex h-6 w-6 items-center justify-center rounded-full",
                          isToday(day) && "bg-cyan-600 font-semibold text-white",
                          !isToday(day) && isSelected && "font-semibold text-cyan-700"
                        )}
                      >
                        {format(day, 'd')}
                      </time>
                      
                      {hasSwim && (
                        <div className="mt-2 space-y-1">
                          {dayLogs.slice(0, 2).map(log => (
                            <div key={log.id} className="truncate rounded bg-cyan-100 px-1.5 py-0.5 text-xs font-medium text-cyan-700">
                              {log.distance}{log.unit}
                            </div>
                          ))}
                          {dayLogs.length > 2 && (
                            <div className="text-xs text-slate-400 pl-1">+{dayLogs.length - 2} more</div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Daily Details Section */}
          <div className="lg:col-span-1">
            <div className="rounded-xl bg-white shadow-sm border border-slate-100 h-full">
              <div className="border-b border-slate-100 px-6 py-4">
                <h3 className="text-lg font-semibold text-slate-900">
                  {format(selectedDate, 'EEEE, MMM d')}
                </h3>
              </div>
              
              <div className="p-6">
                {selectedDateLogs.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center text-slate-500">
                    <Waves className="mb-3 h-12 w-12 text-slate-200" />
                    <p>No swims logged for this day.</p>
                    <button 
                      onClick={() => setIsModalOpen(true)}
                      className="mt-4 text-sm font-medium text-cyan-600 hover:text-cyan-700"
                    >
                      Log a swim
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {selectedDateLogs.map(log => (
                      <div key={log.id} className="group relative rounded-lg border border-slate-200 bg-slate-50 p-4 hover:border-cyan-200 hover:bg-cyan-50/50 transition-all">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-baseline gap-2">
                              <span className="text-xl font-bold text-slate-900">{log.distance}</span>
                              <span className="text-sm font-medium text-slate-500">{log.unit}</span>
                            </div>
                            <p className="text-sm font-medium text-cyan-700">{log.stroke}</p>
                          </div>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteLog(log.id);
                            }}
                            className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-red-500 transition-opacity"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                        
                        {(log.duration || log.notes) && (
                          <div className="mt-3 space-y-1 border-t border-slate-200/60 pt-3">
                            {log.duration && (
                              <div className="flex items-center gap-2 text-xs text-slate-500">
                                <span className="font-medium">Time:</span> {log.duration}
                              </div>
                            )}
                            {log.notes && (
                              <p className="text-xs text-slate-600 italic">"{log.notes}"</p>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <SwimModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={handleAddLog}
        initialDate={format(selectedDate, 'yyyy-MM-dd')}
      />
    </div>
  );
}

export default App;