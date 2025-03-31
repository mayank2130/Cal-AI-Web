"use client";

import { useState } from "react";
import { mockFitnessData } from "@/lib/mock-data";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CircularProgress } from "@/components/ui/circular-progress";
import { SetGoal } from "@/components/ui/set-goal";
import { Modal } from "@/components/ui/modal";
import {
  Activity,
  Flame,
  Heart,
  Moon,
  Droplets,
  Footprints,
  ChevronLeft,
  ChevronRight,
  Dumbbell,
  Clock,
  Settings,
  LayoutGrid,
  AlignJustify,
} from "lucide-react";
import { useTabContext } from "./providers";

export function FitnessTracker() {
  const { steps, calories, heartRate, sleep, water } = mockFitnessData;
  const [currentDayIndex, setCurrentDayIndex] = useState(0);
  const { activeTab, setActiveTab } = useTabContext();
  const [goalModalOpen, setGoalModalOpen] = useState(false);
  const [activeGoal, setActiveGoal] = useState<
    "steps" | "calories" | "sleep" | "water" | null
  >(null);
  const [userGoals, setUserGoals] = useState({
    steps: steps.goal,
    calories: calories.goal,
    sleep: sleep.goal,
    water: water.goal,
  });
  const [gridView, setGridView] = useState(true);

  // Days array (Today at index 0, then previous days)
  const days = [
    "Today",
    "Yesterday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
  ];

  // Calculate total weekly steps
  const totalWeeklySteps = steps.history.reduce(
    (sum, day) => sum + day.count,
    0
  );

  // Handle day navigation
  const goToPreviousDay = () => {
    setCurrentDayIndex((prev) => Math.min(prev + 1, days.length - 1));
  };

  const goToNextDay = () => {
    setCurrentDayIndex((prev) => Math.max(prev - 1, 0));
  };

  // Get current day's data based on the selected day index
  const getCurrentDayData = () => {
    if (currentDayIndex === 0) {
      return {
        steps: steps.current,
        calories: calories.burned,
        sleep: sleep.hours,
        water: water.current,
      };
    } else if (currentDayIndex === 1) {
      // Yesterday's data (using the last item from history)
      return {
        steps: steps.history[0].count,
        calories: calories.history[0].count,
        sleep: sleep.history[0].hours,
        water: water.history[0].amount,
      };
    } else {
      // Get data for other days (adjusting index to match history array)
      const historyIndex = currentDayIndex - 2;
      return {
        steps: steps.history[historyIndex].count,
        calories: calories.history[historyIndex].count,
        sleep: sleep.history[historyIndex].hours,
        water: water.history[historyIndex].amount,
      };
    }
  };

  const dayData = getCurrentDayData();

  // Open goal modal with specific goal type
  const openGoalModal = (
    goalType: "steps" | "calories" | "sleep" | "water"
  ) => {
    setActiveGoal(goalType);
    setGoalModalOpen(true);
  };

  // Save updated goal
  const handleSaveGoal = (value: number) => {
    if (activeGoal) {
      setUserGoals((prev) => ({
        ...prev,
        [activeGoal]: value,
      }));
      setGoalModalOpen(false);
    }
  };

  // Get goal settings based on goal type
  const getGoalSettings = () => {
    if (!activeGoal) return null;

    const settings = {
      steps: {
        title: "Move Goal",
        subtitle: "Set your daily steps goal.",
        initialValue: userGoals.steps,
        unit: "STEPS/DAY",
        min: 1000,
        max: 20000,
        step: 500,
      },
      calories: {
        title: "Calorie Goal",
        subtitle: "Set your daily calorie burn goal.",
        initialValue: userGoals.calories,
        unit: "CALORIES/DAY",
        min: 200,
        max: 5000,
        step: 50,
      },
      sleep: {
        title: "Sleep Goal",
        subtitle: "Set your daily sleep goal.",
        initialValue: userGoals.sleep,
        unit: "HOURS/DAY",
        min: 5,
        max: 12,
        step: 0.5,
      },
      water: {
        title: "Water Goal",
        subtitle: "Set your daily water intake goal.",
        initialValue: userGoals.water,
        unit: "LITERS/DAY",
        min: 1,
        max: 5,
        step: 0.1,
      },
    };

    return settings[activeGoal];
  };

  const goalSettings = getGoalSettings();

  // Toggle between grid and row view
  const toggleView = () => {
    setGridView(!gridView);
  };

  return (
    <div className="max-w-5xl mx-auto pt-20">
      {/* Minimalistic Header */}
      <div className="flex items-center justify-between pb-12 mb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900 dark:text-white">
            Fitness Dashboard
          </h1>
          <div className="flex items-center mt-3">
            <button
              className="p-1 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
              aria-label="Previous day"
              onClick={goToPreviousDay}
            >
              <ChevronLeft size={18} />
            </button>
            <div className="inline-flex items-center px-3">
              <span className="text-base text-slate-700 dark:text-slate-300 font-medium">
                {days[currentDayIndex]}
              </span>
            </div>
            <button
              className="p-1 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
              aria-label="Next day"
              onClick={goToNextDay}
              disabled={currentDayIndex === 0}
            >
              <ChevronRight
                size={18}
                className={currentDayIndex === 0 ? "opacity-30" : ""}
              />
            </button>
          </div>
        </div>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full border-none"
      >
        <TabsList className="w-full justify-start mb-8 border-b border-slate-200 dark:border-slate-800 px-0 bg-transparent">
          {["overview", "activity", "nutrition", "sleep", "workouts"].map(
            (tab) => (
              <TabsTrigger
                key={tab}
                value={tab}
                className="rounded-2xl data-[state=active]:bg-white border p-4  border-transparent data-[state=active]:border-black dark:data-[state=active]:border-white text-base px-8 pb-4 capitalize dark:text-slate-300 dark:data-[state=active]:text-white"
              >
                {tab}
              </TabsTrigger>
            )
          )}
        </TabsList>

        <TabsContent value="overview" className="space-y-8">
          {/* View Toggle Button */}
          <div className="flex justify-end">
            <button
              onClick={toggleView}
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors border border-slate-200 dark:border-slate-700 rounded-lg"
              aria-label={
                gridView ? "Switch to row view" : "Switch to grid view"
              }
            >
              {gridView ? (
                <>
                  <AlignJustify size={16} />
                  <span>Row View</span>
                </>
              ) : (
                <>
                  <LayoutGrid size={16} />
                  <span>Grid View</span>
                </>
              )}
            </button>
          </div>

          {/* Cards section with conditional classes based on view */}
          <div
            className={`grid gap-6 ${
              gridView ? "md:grid-cols-2" : "md:grid-cols-2 lg:grid-cols-4"
            }`}
          >
            {/* Steps Card */}
            <Card className="border border-slate-100 dark:border-slate-800 bg-white dark:bg-black shadow-sm rounded-lg overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 pt-6">
                <CardTitle className="text-base font-medium dark:text-white">
                  Steps
                </CardTitle>
                <div className="flex items-center">
                  <div className="h-9 w-9 rounded-full bg-slate-50 dark:bg-slate-900 flex items-center justify-center mr-2">
                    <Footprints className="w-5 h-5 text-slate-500 dark:text-slate-400" />
                  </div>
                  <button
                    onClick={() => openGoalModal("steps")}
                    className="h-6 w-6 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                    aria-label="Set steps goal"
                  >
                    <Settings className="w-3 h-3 text-slate-500 dark:text-slate-400" />
                  </button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-3xl font-bold text-slate-900 dark:text-white">
                      {dayData.steps.toLocaleString()}
                    </div>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                      Goal: {userGoals.steps.toLocaleString()} steps
                    </p>
                  </div>
                  <CircularProgress
                    value={(dayData.steps / userGoals.steps) * 100}
                    size={70}
                    strokeWidth={3}
                    label={
                      <span className="text-sm font-semibold dark:text-white">
                        {Math.round((dayData.steps / userGoals.steps) * 100)}%
                      </span>
                    }
                  />
                </div>
              </CardContent>
            </Card>

            {/* Calories Card */}
            <Card className="border border-slate-100 dark:border-slate-800 bg-white dark:bg-black shadow-sm rounded-lg overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 pt-6">
                <CardTitle className="text-base font-medium dark:text-white">
                  Calories
                </CardTitle>
                <div className="flex items-center">
                  <div className="h-9 w-9 rounded-full bg-slate-50 dark:bg-slate-900 flex items-center justify-center mr-2">
                    <Flame className="w-5 h-5 text-slate-500 dark:text-slate-400" />
                  </div>
                  <button
                    onClick={() => openGoalModal("calories")}
                    className="h-6 w-6 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                    aria-label="Set calorie goal"
                  >
                    <Settings className="w-3 h-3 text-slate-500 dark:text-slate-400" />
                  </button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-3xl font-bold text-slate-900 dark:text-white">
                      {dayData.calories.toLocaleString()}
                    </div>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                      Goal: {userGoals.calories.toLocaleString()} kcal
                    </p>
                  </div>
                  <CircularProgress
                    value={(dayData.calories / userGoals.calories) * 100}
                    size={70}
                    strokeWidth={3}
                    label={
                      <span className="text-sm font-semibold dark:text-white">
                        {Math.round(
                          (dayData.calories / userGoals.calories) * 100
                        )}
                        %
                      </span>
                    }
                  />
                </div>
              </CardContent>
            </Card>

            {/* Heart Rate Card */}
            <Card className="border border-slate-100 dark:border-slate-800 bg-white dark:bg-black shadow-sm rounded-lg overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 pt-6">
                <CardTitle className="text-base font-medium dark:text-white">
                  Heart Rate
                </CardTitle>
                <div className="h-9 w-9 rounded-full bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
                  <Heart className="w-5 h-5 text-slate-500 dark:text-slate-400" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-3xl font-bold text-slate-900 dark:text-white">
                      {heartRate.current} bpm
                    </div>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                      Resting
                    </p>
                  </div>
                  <CircularProgress
                    value={
                      ((heartRate.current - heartRate.min) /
                        (heartRate.max - heartRate.min)) *
                      100
                    }
                    size={70}
                    strokeWidth={3}
                    indicatorColor="#ef4444"
                  />
                </div>
                <div className="flex justify-between mt-4 text-sm text-slate-500 dark:text-slate-400">
                  <div>Min: {heartRate.min} bpm</div>
                  <div>Max: {heartRate.max} bpm</div>
                </div>
              </CardContent>
            </Card>

            {/* Sleep Card */}
            <Card className="border border-slate-100 dark:border-slate-800 bg-white dark:bg-black shadow-sm rounded-lg overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 pt-6">
                <CardTitle className="text-base font-medium dark:text-white">
                  Sleep
                </CardTitle>
                <div className="flex items-center">
                  <div className="h-9 w-9 rounded-full bg-slate-50 dark:bg-slate-900 flex items-center justify-center mr-2">
                    <Moon className="w-5 h-5 text-slate-500 dark:text-slate-400" />
                  </div>
                  <button
                    onClick={() => openGoalModal("sleep")}
                    className="h-6 w-6 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                    aria-label="Set sleep goal"
                  >
                    <Settings className="w-3 h-3 text-slate-500 dark:text-slate-400" />
                  </button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-3xl font-bold text-slate-900 dark:text-white">
                      {dayData.sleep} hrs
                    </div>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                      Goal: {userGoals.sleep} hours
                    </p>
                  </div>
                  <CircularProgress
                    value={(dayData.sleep / userGoals.sleep) * 100}
                    size={70}
                    strokeWidth={3}
                    indicatorColor="#8b5cf6"
                    label={
                      <span className="text-sm font-semibold dark:text-white">
                        {Math.round((dayData.sleep / userGoals.sleep) * 100)}%
                      </span>
                    }
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Upcoming Workouts Section */}
          <Card className="border border-slate-100 dark:border-slate-800 bg-white dark:bg-black shadow-sm rounded-lg">
            <CardHeader className="pt-6 pb-2">
              <CardTitle className="text-xl font-semibold dark:text-white">
                Upcoming Workouts
              </CardTitle>
              <CardDescription className="text-base text-slate-500 dark:text-slate-400">
                Your scheduled training sessions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    day: "Today",
                    name: "Upper Body Strength",
                    time: "5:30 PM",
                    duration: "45 min",
                  },
                  {
                    day: "Tomorrow",
                    name: "Cardio HIIT",
                    time: "6:00 AM",
                    duration: "30 min",
                  },
                  {
                    day: "Wednesday",
                    name: "Lower Body & Core",
                    time: "5:30 PM",
                    duration: "50 min",
                  },
                ].map((workout, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between py-3 border-b border-slate-100 dark:border-slate-800 last:border-0"
                  >
                    <div className="flex items-center">
                      <div className="h-10 w-10 bg-slate-50 dark:bg-slate-900 rounded-full flex items-center justify-center mr-3">
                        <Activity className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-900 dark:text-white">
                          {workout.name}
                        </p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          {workout.day} • {workout.time}
                        </p>
                      </div>
                    </div>
                    <div className="text-sm text-slate-500 dark:text-slate-400">
                      {workout.duration}
                    </div>
                  </div>
                ))}
                <button className="w-full mt-3 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors py-2 px-4 border border-slate-200 dark:border-slate-700 rounded-lg">
                  View Full Schedule
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Activity Summary Card - Redesigned to match the image */}
          <Card className="border border-slate-100 dark:border-slate-800 bg-white dark:bg-black shadow-sm rounded-lg">
            <CardHeader className="pt-6 pb-2">
              <CardTitle className="text-xl font-semibold dark:text-white">
                Activity Summary
              </CardTitle>
              <CardDescription className="text-base text-slate-500 dark:text-slate-400">
                Your weekly activity overview
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Weekly Steps with number and chart */}
              <div className="mb-8">
                <h3 className="text-base font-medium mb-3 dark:text-white">
                  Weekly Steps
                </h3>
                <div className="text-4xl font-bold text-slate-900 dark:text-white mb-8">
                  {totalWeeklySteps.toLocaleString()}
                </div>

                <div className="relative">
                  {/* Day labels */}
                  <div className="flex justify-between mb-2">
                    {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
                      (day, index) => (
                        <div
                          key={index}
                          className="text-xs text-slate-500 dark:text-slate-400 font-medium text-center w-10"
                        >
                          {day}
                        </div>
                      )
                    )}
                  </div>

                  {/* Bar charts */}
                  <div className="flex justify-between items-end h-24 mb-8">
                    {steps.history.map((day, index) => (
                      <div
                        key={index}
                        className="relative w-10 bg-black dark:bg-white rounded-sm"
                        style={{
                          height: `${(day.count / steps.goal) * 100}%`,
                          maxHeight: "100%",
                          opacity: index === 6 ? 1 : 0.85,
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <h3 className="text-lg font-medium mb-5 dark:text-white">
                Daily Goals
              </h3>

              {/* Steps Goal */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center">
                    <div className="mr-3 h-9 w-9 rounded-full bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
                      <Footprints className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                    </div>
                    <span className="text-base text-slate-700 dark:text-slate-300">
                      Steps
                    </span>
                  </div>
                  <span className="text-sm font-medium dark:text-white">
                    {Math.round((dayData.steps / steps.goal) * 100)}%
                  </span>
                </div>
                <div className="mt-4 relative h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="absolute top-0 left-0 h-full bg-black dark:bg-white rounded-full"
                    style={{
                      width: `${Math.min(
                        Math.round((dayData.steps / steps.goal) * 100),
                        100
                      )}%`,
                    }}
                  />
                </div>
              </div>

              {/* Calories Goal */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center">
                    <div className="mr-3 h-9 w-9 rounded-full bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
                      <Flame className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                    </div>
                    <span className="text-base text-slate-700 dark:text-slate-300">
                      Calories
                    </span>
                  </div>
                  <span className="text-sm font-medium dark:text-white">
                    {Math.round((dayData.calories / calories.goal) * 100)}%
                  </span>
                </div>
                <div className="mt-4 relative h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="absolute top-0 left-0 h-full bg-black dark:bg-white rounded-full"
                    style={{
                      width: `${Math.min(
                        Math.round((dayData.calories / calories.goal) * 100),
                        100
                      )}%`,
                    }}
                  />
                </div>
              </div>

              {/* Water Goal */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center">
                    <div className="mr-3 h-9 w-9 rounded-full bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
                      <Droplets className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                    </div>
                    <span className="text-base text-slate-700 dark:text-slate-300">
                      Water
                    </span>
                  </div>
                  <span className="text-sm font-medium dark:text-white">
                    {Math.round((dayData.water / water.goal) * 100)}%
                  </span>
                </div>
                <div className="mt-4 relative h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="absolute top-0 left-0 h-full bg-black dark:bg-white rounded-full"
                    style={{
                      width: `${Math.min(
                        Math.round((dayData.water / water.goal) * 100),
                        100
                      )}%`,
                    }}
                  />
                </div>
              </div>

              {/* Sleep Goal */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center">
                    <div className="mr-3 h-9 w-9 rounded-full bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
                      <Moon className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                    </div>
                    <span className="text-base text-slate-700 dark:text-slate-300">
                      Sleep
                    </span>
                  </div>
                  <span className="text-sm font-medium dark:text-white">
                    {Math.round((dayData.sleep / sleep.goal) * 100)}%
                  </span>
                </div>
                <div className="mt-4 relative h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="absolute top-0 left-0 h-full bg-black dark:bg-white rounded-full"
                    style={{
                      width: `${Math.min(
                        Math.round((dayData.sleep / sleep.goal) * 100),
                        100
                      )}%`,
                    }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Personal Records Section */}
          <Card className="border border-slate-100 dark:border-slate-800 bg-white dark:bg-black shadow-sm rounded-lg">
            <CardHeader className="pt-6 pb-2">
              <CardTitle className="text-xl font-semibold dark:text-white">
                Personal Records
              </CardTitle>
              <CardDescription className="text-base text-slate-500 dark:text-slate-400">
                Your achievements so far
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-base font-medium mb-4 dark:text-white">
                    Running
                  </h3>
                  <div className="space-y-4">
                    {[
                      { label: "Fastest 5K", value: "23:45", date: "May 15" },
                      {
                        label: "Longest Run",
                        value: "14.8 km",
                        date: "April 30",
                      },
                      { label: "Best Pace", value: "4:35 /km", date: "May 2" },
                    ].map((record, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center">
                          <div className="h-8 w-8 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mr-3">
                            <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
                              {index + 1}
                            </span>
                          </div>
                          <span className="text-slate-600 dark:text-slate-300">
                            {record.label}
                          </span>
                        </div>
                        <div className="text-right">
                          <div className="font-medium text-slate-900 dark:text-white">
                            {record.value}
                          </div>
                          <div className="text-xs text-slate-500 dark:text-slate-400">
                            {record.date}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-base font-medium mb-4 dark:text-white">
                    Strength
                  </h3>
                  <div className="space-y-4">
                    {[
                      { label: "Squat", value: "120 kg", date: "June 3" },
                      { label: "Bench Press", value: "85 kg", date: "May 28" },
                      { label: "Deadlift", value: "150 kg", date: "June 5" },
                    ].map((record, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center">
                          <div className="h-8 w-8 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mr-3">
                            <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
                              {index + 1}
                            </span>
                          </div>
                          <span className="text-slate-600 dark:text-slate-300">
                            {record.label}
                          </span>
                        </div>
                        <div className="text-right">
                          <div className="font-medium text-slate-900 dark:text-white">
                            {record.value}
                          </div>
                          <div className="text-xs text-slate-500 dark:text-slate-400">
                            {record.date}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="space-y-6">
          <Card className="border border-slate-100 dark:border-slate-800 bg-white dark:bg-black shadow-sm rounded-lg">
            <CardHeader className="pt-6">
              <CardTitle className="text-xl font-semibold dark:text-white">
                Activity
              </CardTitle>
              <CardDescription className="text-base dark:text-slate-400">
                Your activity details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="grid grid-cols-2 gap-10">
                <div className="space-y-4">
                  <p className="text-lg font-medium dark:text-white">
                    Steps Today
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="text-4xl font-bold text-slate-900 dark:text-white">
                      {dayData.steps.toLocaleString()}
                    </div>
                    <CircularProgress
                      value={(dayData.steps / steps.goal) * 100}
                      size={90}
                      strokeWidth={4}
                      label={
                        <span className="text-base font-semibold dark:text-white">
                          {Math.round((dayData.steps / steps.goal) * 100)}%
                        </span>
                      }
                    />
                  </div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Goal: {steps.goal.toLocaleString()} steps
                  </p>
                </div>

                <div className="space-y-4">
                  <p className="text-lg font-medium dark:text-white">
                    Calories Burned
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="text-4xl font-bold text-slate-900 dark:text-white">
                      {dayData.calories.toLocaleString()}
                    </div>
                    <CircularProgress
                      value={(dayData.calories / calories.goal) * 100}
                      size={90}
                      strokeWidth={4}
                      label={
                        <span className="text-base font-semibold dark:text-white">
                          {Math.round((dayData.calories / calories.goal) * 100)}
                          %
                        </span>
                      }
                    />
                  </div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Goal: {calories.goal.toLocaleString()} kcal
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Visual Separator */}
          <div className="relative py-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200 dark:border-slate-700"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="bg-gray-50 dark:bg-black px-4 text-sm font-medium text-slate-600 dark:text-slate-300 flex items-center space-x-2">
                <Activity className="h-3.5 w-3.5 mr-1.5 text-slate-500 dark:text-slate-400" />
                Workout Details
              </span>
            </div>
          </div>

          {/* Workout History Section */}
          <Card className="border border-slate-100 dark:border-slate-800 bg-white dark:bg-black shadow-sm rounded-lg">
            <CardHeader className="pt-6">
              <CardTitle className="text-xl font-semibold dark:text-white">
                Recent Workouts
              </CardTitle>
              <CardDescription className="text-base dark:text-slate-400">
                Your workout history
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {[
                  {
                    date: "Today",
                    name: "Morning Run",
                    stats: "5.2 km • 27 min • 326 kcal",
                    intensity: "Moderate",
                  },
                  {
                    date: "Yesterday",
                    name: "Upper Body",
                    stats: "45 min • 280 kcal",
                    intensity: "Intense",
                  },
                  {
                    date: "Monday",
                    name: "Yoga",
                    stats: "30 min • 120 kcal",
                    intensity: "Light",
                  },
                ].map((workout, index) => (
                  <div
                    key={index}
                    className="flex items-start justify-between pb-4 border-b border-slate-100 dark:border-slate-800 last:border-0 last:pb-0"
                  >
                    <div className="flex items-start">
                      <div className="h-10 w-10 bg-slate-900 dark:bg-slate-700 text-white rounded-full flex items-center justify-center mr-4 mt-1">
                        <Activity className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-medium text-slate-900 dark:text-white">
                          {workout.name}
                        </h4>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          {workout.date}
                        </p>
                        <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
                          {workout.stats}
                        </p>
                      </div>
                    </div>
                    <div
                      className={`text-xs px-2 py-1 rounded-full ${
                        workout.intensity === "Light"
                          ? "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                          : workout.intensity === "Moderate"
                          ? "bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                          : "bg-orange-50 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300"
                      }`}
                    >
                      {workout.intensity}
                    </div>
                  </div>
                ))}

                <button className="w-full text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors py-2 px-4 border border-slate-200 dark:border-slate-700 rounded-lg">
                  View All Workouts
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Visual Separator for Heart Rate Zones */}
          <div className="relative py-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200 dark:border-slate-700"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="bg-gray-50 dark:bg-black px-4 text-sm font-medium text-slate-600 dark:text-slate-300 flex items-center space-x-2">
                <Heart className="h-3.5 w-3.5 mr-1.5 text-slate-500 dark:text-slate-400" />
                Heart Rate Data
              </span>
            </div>
          </div>

          {/* Zone Training */}
          <Card className="border border-slate-100 dark:border-slate-800 bg-white dark:bg-black shadow-sm rounded-lg">
            <CardHeader className="pt-6">
              <CardTitle className="text-xl font-semibold dark:text-white">
                Heart Rate Zones
              </CardTitle>
              <CardDescription className="text-base dark:text-slate-400">
                Time spent in each training zone today
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    zone: "Zone 1 (Recovery)",
                    percent: 30,
                    time: "15 min",
                    color: "bg-blue-500",
                  },
                  {
                    zone: "Zone 2 (Endurance)",
                    percent: 45,
                    time: "22 min",
                    color: "bg-green-500",
                  },
                  {
                    zone: "Zone 3 (Tempo)",
                    percent: 20,
                    time: "10 min",
                    color: "bg-yellow-500",
                  },
                  {
                    zone: "Zone 4 (Threshold)",
                    percent: 5,
                    time: "3 min",
                    color: "bg-orange-500",
                  },
                  {
                    zone: "Zone 5 (Max)",
                    percent: 0,
                    time: "0 min",
                    color: "bg-red-500",
                  },
                ].map((zone, index) => (
                  <div key={index} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-700 dark:text-slate-300">
                        {zone.zone}
                      </span>
                      <span className="text-sm font-medium dark:text-white">
                        {zone.time}
                      </span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${zone.color}`}
                        style={{ width: `${zone.percent}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="nutrition" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border border-slate-100 dark:border-slate-800 bg-white dark:bg-black shadow-sm rounded-lg md:col-span-2">
              <CardHeader className="pt-6">
                <CardTitle className="text-xl font-semibold dark:text-white">
                  Nutrition Breakdown
                </CardTitle>
                <CardDescription className="text-base dark:text-slate-400">
                  Your daily macronutrient distribution
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h4 className="text-3xl font-bold text-slate-900 dark:text-white">
                      1,840
                    </h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Calories consumed
                    </p>
                  </div>
                  <div className="flex items-center space-x-8">
                    <div className="text-center">
                      <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-slate-50 dark:bg-slate-800">
                        <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center">
                          <span className="text-xs font-medium text-white">
                            42%
                          </span>
                        </div>
                      </div>
                      <p className="mt-1 text-sm font-medium text-slate-900 dark:text-white">
                        Carbs
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        196g
                      </p>
                    </div>
                    <div className="text-center">
                      <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-slate-50 dark:bg-slate-800">
                        <div className="h-10 w-10 rounded-full bg-red-500 flex items-center justify-center">
                          <span className="text-xs font-medium text-white">
                            30%
                          </span>
                        </div>
                      </div>
                      <p className="mt-1 text-sm font-medium text-slate-900 dark:text-white">
                        Protein
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        138g
                      </p>
                    </div>
                    <div className="text-center">
                      <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-slate-50 dark:bg-slate-800">
                        <div className="h-10 w-10 rounded-full bg-yellow-500 flex items-center justify-center">
                          <span className="text-xs font-medium text-white">
                            28%
                          </span>
                        </div>
                      </div>
                      <p className="mt-1 text-sm font-medium text-slate-900 dark:text-white">
                        Fats
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        58g
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium dark:text-white">Today&apos;s Meals</h4>
                  {[
                    {
                      meal: "Breakfast",
                      time: "7:30 AM",
                      calories: 420,
                      items: "Oatmeal with berries, Greek yogurt",
                    },
                    {
                      meal: "Lunch",
                      time: "12:15 PM",
                      calories: 650,
                      items: "Grilled chicken salad, whole grain bread",
                    },
                    {
                      meal: "Snack",
                      time: "3:30 PM",
                      calories: 180,
                      items: "Protein shake, banana",
                    },
                    {
                      meal: "Dinner",
                      time: "7:00 PM",
                      calories: 590,
                      items: "Salmon, quinoa, roasted vegetables",
                    },
                  ].map((meal, index) => (
                    <div
                      key={index}
                      className="flex items-start justify-between py-3 border-b border-slate-100 dark:border-slate-800 last:border-0"
                    >
                      <div>
                        <div className="flex items-center">
                          <h5 className="font-medium text-slate-900 dark:text-white">
                            {meal.meal}
                          </h5>
                          <span className="text-xs text-slate-500 dark:text-slate-400 ml-2">
                            • {meal.time}
                          </span>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
                          {meal.items}
                        </p>
                      </div>
                      <div className="text-sm font-medium text-slate-900 dark:text-white">
                        {meal.calories} kcal
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="space-y-6">
              <Card className="border border-slate-100 dark:border-slate-800 bg-white dark:bg-black shadow-sm rounded-lg">
                <CardHeader className="pt-6">
                  <CardTitle className="text-base font-medium dark:text-white">
                    Water Intake
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-3xl font-bold text-slate-900 dark:text-white">
                        {dayData.water} L
                      </div>
                      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                        Goal: {water.goal} L
                      </p>
                    </div>
                    <CircularProgress
                      value={(dayData.water / water.goal) * 100}
                      size={70}
                      strokeWidth={3}
                      indicatorColor="#3b82f6"
                      label={
                        <span className="text-sm font-semibold dark:text-white">
                          {Math.round((dayData.water / water.goal) * 100)}%
                        </span>
                      }
                    />
                  </div>
                  <Progress
                    value={(dayData.water / water.goal) * 100}
                    className="h-1 mt-4 bg-slate-100 dark:bg-slate-800"
                  />

                  <div className="mt-4 grid grid-cols-8 gap-2">
                    {Array.from({ length: 8 }).map((_, index) => (
                      <button
                        key={index}
                        className={`h-8 rounded-lg flex items-center justify-center ${
                          index < Math.ceil((dayData.water / water.goal) * 8)
                            ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                            : "bg-slate-50 text-slate-400 dark:bg-slate-800 dark:text-slate-500"
                        }`}
                      >
                        <Droplets className="h-4 w-4" />
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-slate-100 dark:border-slate-800 bg-white dark:bg-black shadow-sm rounded-lg">
                <CardHeader className="pt-6">
                  <CardTitle className="text-base font-medium dark:text-white">
                    Recommended Foods
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      {
                        name: "Protein Sources",
                        items: "Chicken, Eggs, Greek Yogurt",
                      },
                      {
                        name: "Complex Carbs",
                        items: "Sweet Potato, Brown Rice, Oats",
                      },
                      {
                        name: "Healthy Fats",
                        items: "Avocado, Nuts, Olive Oil",
                      },
                    ].map((category, index) => (
                      <div
                        key={index}
                        className="pb-3 border-b border-slate-100 dark:border-slate-800 last:border-0"
                      >
                        <h5 className="text-sm font-medium text-slate-900 dark:text-white">
                          {category.name}
                        </h5>
                        <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                          {category.items}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="sleep" className="space-y-6">
          <Card className="border border-slate-100 dark:border-slate-800 bg-white dark:bg-black shadow-sm rounded-lg">
            <CardHeader className="pt-6">
              <CardTitle className="text-xl font-semibold dark:text-white">
                Sleep
              </CardTitle>
              <CardDescription className="text-base dark:text-slate-400">
                Your sleep data
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="space-y-4">
                <p className="text-lg font-medium dark:text-white">
                  Last Night
                </p>
                <div className="flex items-center justify-between">
                  <div className="text-4xl font-bold text-slate-900 dark:text-white">
                    {dayData.sleep} hrs
                  </div>
                  <CircularProgress
                    value={(dayData.sleep / sleep.goal) * 100}
                    size={90}
                    strokeWidth={4}
                    indicatorColor="#8b5cf6"
                    label={
                      <span className="text-base font-semibold dark:text-white">
                        {Math.round((dayData.sleep / sleep.goal) * 100)}%
                      </span>
                    }
                  />
                </div>
                <Progress
                  value={(dayData.sleep / sleep.goal) * 100}
                  className="h-2 mt-2 bg-slate-100 dark:bg-slate-800 [&>div]:bg-black dark:[&>div]:bg-white"
                />
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Goal: {sleep.goal} hours
                </p>
              </div>

              <div className="mt-8">
                <p className="text-lg font-medium mb-6 dark:text-white">
                  Weekly Sleep
                </p>
                <div className="relative">
                  {/* Day labels */}
                  <div className="flex justify-between mb-2">
                    {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
                      (day, index) => (
                        <div
                          key={index}
                          className="text-xs text-slate-500 dark:text-slate-400 font-medium text-center w-10"
                        >
                          {day}
                        </div>
                      )
                    )}
                  </div>

                  {/* Bar charts */}
                  <div className="flex justify-between items-end h-24 mb-8">
                    {sleep.history.map((day, index) => (
                      <div
                        key={index}
                        className="relative w-10 bg-black dark:bg-white rounded-sm"
                        style={{
                          height: `${(day.hours / 12) * 100}%`,
                          maxHeight: "100%",
                          opacity: index === 6 ? 1 : 0.85,
                        }}
                      />
                    ))}
                  </div>
                </div>

                {/* Sleep analytics */}
                <div className="grid grid-cols-3 gap-4 mt-6">
                  <div className="p-4 rounded-lg bg-white dark:bg-black border border-slate-100 dark:border-slate-800">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center mr-3">
                        <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
                          💤
                        </span>
                      </div>
                      <div>
                        <span className="text-sm text-slate-600 dark:text-slate-300">
                          Best Sleep
                        </span>
                        <div className="font-medium text-slate-900 dark:text-white">
                          8.5h
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-lg bg-white dark:bg-black border border-slate-100 dark:border-slate-800">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center mr-3">
                        <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
                          ⌚
                        </span>
                      </div>
                      <div>
                        <span className="text-sm text-slate-600 dark:text-slate-300">
                          Average
                        </span>
                        <div className="font-medium text-slate-900 dark:text-white">
                          7.2h
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-lg bg-white dark:bg-black border border-slate-100 dark:border-slate-800">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center mr-3">
                        <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
                          🛌
                        </span>
                      </div>
                      <div>
                        <span className="text-sm text-slate-600 dark:text-slate-300">
                          Goal
                        </span>
                        <div className="font-medium text-slate-900 dark:text-white">
                          {sleep.goal}h
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* New Workouts Tab */}
        <TabsContent value="workouts" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
              <Card className="border border-slate-100 dark:border-slate-800 bg-white dark:bg-black shadow-sm rounded-lg">
                <CardHeader className="pt-6">
                  <CardTitle className="text-xl font-semibold dark:text-white">
                    Workout Programs
                  </CardTitle>
                  <CardDescription className="text-base dark:text-slate-400">
                    Your active training plans
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      {
                        name: "12-Week Strength Builder",
                        progress: 65,
                        startDate: "Apr 12",
                        endDate: "Jul 5",
                        nextWorkout: "Upper Body - Day 4",
                      },
                      {
                        name: "5K Training Plan",
                        progress: 40,
                        startDate: "May 1",
                        endDate: "Jun 15",
                        nextWorkout: "Speed Intervals - Day 8",
                      },
                    ].map((program, index) => (
                      <div
                        key={index}
                        className="p-4 border border-slate-100 dark:border-slate-800 rounded-lg"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="font-medium text-slate-900 dark:text-white">
                            {program.name}
                          </h3>
                          <span className="text-sm font-medium dark:text-white">
                            {program.progress}%
                          </span>
                        </div>
                        <Progress
                          value={program.progress}
                          className="h-1 mb-4 bg-slate-100 dark:bg-slate-800 [&>div]:bg-black dark:[&>div]:bg-white"
                        />
                        <div className="flex items-center justify-between text-sm">
                          <div className="text-slate-500 dark:text-slate-400">
                            {program.startDate} - {program.endDate}
                          </div>
                          <div className="text-slate-900 dark:text-white font-medium">
                            Next: {program.nextWorkout}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-slate-100 dark:border-slate-800 bg-white dark:bg-black shadow-sm rounded-lg">
                <CardHeader className="pt-6">
                  <CardTitle className="text-xl font-semibold dark:text-white">
                    Recent Workouts
                  </CardTitle>
                  <CardDescription className="text-base dark:text-slate-400">
                    Your workout history
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {[
                      {
                        date: "Today",
                        name: "Morning Run",
                        stats: "5.2 km • 27 min • 326 kcal",
                        intensity: "Moderate",
                      },
                      {
                        date: "Yesterday",
                        name: "Upper Body",
                        stats: "45 min • 280 kcal",
                        intensity: "Intense",
                      },
                      {
                        date: "Monday",
                        name: "Yoga",
                        stats: "30 min • 120 kcal",
                        intensity: "Light",
                      },
                    ].map((workout, index) => (
                      <div
                        key={index}
                        className="flex items-start justify-between pb-4 border-b border-slate-100 dark:border-slate-800 last:border-0 last:pb-0"
                      >
                        <div className="flex items-start">
                          <div className="h-10 w-10 bg-slate-900 dark:bg-slate-700 text-white rounded-full flex items-center justify-center mr-4 mt-1">
                            <Activity className="h-5 w-5" />
                          </div>
                          <div>
                            <h4 className="font-medium text-slate-900 dark:text-white">
                              {workout.name}
                            </h4>
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                              {workout.date}
                            </p>
                            <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
                              {workout.stats}
                            </p>
                          </div>
                        </div>
                        <div
                          className={`text-xs px-2 py-1 rounded-full ${
                            workout.intensity === "Light"
                              ? "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                              : workout.intensity === "Moderate"
                              ? "bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                              : "bg-orange-50 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300"
                          }`}
                        >
                          {workout.intensity}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="border border-slate-100 dark:border-slate-800 bg-white dark:bg-black shadow-sm rounded-lg">
                <CardHeader className="pt-6">
                  <CardTitle className="text-xl font-semibold dark:text-white">
                    Weekly Goals
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      {
                        name: "Workouts",
                        current: 3,
                        goal: 5,
                        icon: <Dumbbell className="h-4 w-4" />,
                      },
                      {
                        name: "Active Minutes",
                        current: 180,
                        goal: 300,
                        icon: <Clock className="h-4 w-4" />,
                      },
                      {
                        name: "Calories Burned",
                        current: 1750,
                        goal: 3000,
                        icon: <Flame className="h-4 w-4" />,
                      },
                    ].map((goal, index) => (
                      <div key={index} className="space-y-4">
                        <div className="flex items-center">
                          <div className="h-8 w-8 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mr-3">
                            {goal.icon}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-slate-900 dark:text-white">
                              {goal.name}
                            </div>
                            <div className="text-xs text-slate-500 dark:text-slate-400">
                              {goal.current} / {goal.goal}{" "}
                              {goal.name === "Calories Burned" ? "kcal" : ""}
                            </div>
                          </div>
                        </div>
                        <Progress
                          value={(goal.current / goal.goal) * 100}
                          className="h-1 mt-4 bg-slate-100 dark:bg-slate-800 [&>div]:bg-black dark:[&>div]:bg-white"
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-slate-100 dark:border-slate-800 bg-white dark:bg-black shadow-sm rounded-lg">
                <CardHeader className="pt-6">
                  <CardTitle className="text-xl font-semibold dark:text-white">
                    Personal Records
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { name: "Fastest 5K", value: "23:45", date: "May 15" },
                      {
                        name: "Longest Run",
                        value: "14.8 km",
                        date: "April 30",
                      },
                      { name: "Max Squat", value: "120 kg", date: "June 3" },
                      { name: "Push-ups", value: "45 reps", date: "May 22" },
                    ].map((record, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 last:border-0"
                      >
                        <span className="text-sm text-slate-600 dark:text-slate-300">
                          {record.name}
                        </span>
                        <div className="text-right">
                          <div className="text-sm font-medium text-slate-900 dark:text-white">
                            {record.value}
                          </div>
                          <div className="text-xs text-slate-500 dark:text-slate-400">
                            {record.date}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Modal for goal setting */}
      <Modal isOpen={goalModalOpen} onClose={() => setGoalModalOpen(false)}>
        {goalSettings && (
          <SetGoal
            title={goalSettings.title}
            subtitle={goalSettings.subtitle}
            initialValue={goalSettings.initialValue}
            unit={goalSettings.unit}
            min={goalSettings.min}
            max={goalSettings.max}
            step={goalSettings.step}
            onSave={handleSaveGoal}
          />
        )}
      </Modal>
    </div>
  );
}
