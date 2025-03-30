import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface ElectionStats {
  totalVoters: number;
  votedCount: number;
  remainingVoters: number;
  completionPercentage: number;
  recentVoters: Array<{
    id: string;
    name: string;
    voterId: string;
    votedAt: Date;
  }>;
  votingActivity: {
    year: {
      labels: string[];
      data: number[];
    };
    class: {
      labels: string[];
      data: number[];
    };
    house: {
      labels: string[];
      data: number[];
    };
  };
}

interface ElectionContextType {
  stats: ElectionStats;
  electionStatus: "not-started" | "active" | "ended";
  timeRemaining: string;
  isDemo: boolean;
  setIsDemo: (demo: boolean) => void;
  updateStats: () => void;
}

const ElectionContext = createContext<ElectionContextType | undefined>(
  undefined
);

const initialStats: ElectionStats = {
  totalVoters: 592,
  votedCount: 458,
  remainingVoters: 134,
  completionPercentage: 77,
  recentVoters: [
    {
      id: "voter-1",
      name: "Voter 871",
      voterId: "VOTER6869",
      votedAt: new Date("2025-05-15T12:45:00"),
    },
    {
      id: "voter-2",
      name: "Voter 882",
      voterId: "VOTER4497",
      votedAt: new Date("2025-05-15T12:44:30"),
    },
    {
      id: "voter-3",
      name: "Voter 319",
      voterId: "VOTER6207",
      votedAt: new Date("2025-05-15T12:44:00"),
    },
  ],
  votingActivity: {
    year: {
      labels: ["2023", "2024", "2025"],
      data: [120, 180, 160],
    },
    class: {
      labels: ["Form 3A", "Form 3B", "Form 3C", "Form 3D"],
      data: [210, 170, 140, 90],
    },
    house: {
      labels: ["Red House", "Blue House", "Green House", "Yellow House"],
      data: [150, 190, 130, 170],
    },
  },
};

export const ElectionProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [stats, setStats] = useState<ElectionStats>(initialStats);
  const [isDemo, setIsDemo] = useState(true);
  const [electionStatus, setElectionStatus] = useState<
    "not-started" | "active" | "ended"
  >("active");
  const [timeRemaining, setTimeRemaining] = useState("");

  useEffect(() => {
    const updateTimer = () => {
      const now = new Date();
      let targetTime: Date;

      if (isDemo) {
        // Demo mode: 5 minutes countdown
        const demoStart = new Date();
        demoStart.setMinutes(demoStart.getMinutes()); // Start in 2 minutes
        const demoEnd = new Date(demoStart);
        demoEnd.setMinutes(demoEnd.getMinutes() + 99999999); // Run for 3 minutes

        if (now < demoStart) {
          setElectionStatus("not-started");
          targetTime = demoStart;
        } else if (now < demoEnd) {
          setElectionStatus("active");
          targetTime = demoEnd;
        } else {
          setElectionStatus("ended");
          setTimeRemaining("Election has ended");
          return;
        }
      } else {
        const electionStart = new Date("2025-05-15T08:00:00");
        const electionEnd = new Date("2025-05-15T17:00:00");

        if (now < electionStart) {
          setElectionStatus("not-started");
          targetTime = electionStart;
        } else if (now < electionEnd) {
          setElectionStatus("active");
          targetTime = electionEnd;
        } else {
          setElectionStatus("ended");
          setTimeRemaining("Election has ended");
          return;
        }
      }

      const diff = targetTime.getTime() - now.getTime();
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeRemaining(
        `${hours.toString().padStart(2, "0")}:${minutes
          .toString()
          .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
      );
    };

    updateTimer();
    const timer = setInterval(updateTimer, 1000);
    return () => clearInterval(timer);
  }, [isDemo]);

  useEffect(() => {
    if (electionStatus !== "active") return;

    const interval = setInterval(() => {
      setStats((prev) => {
        const newVotedCount = Math.min(prev.votedCount + 1, prev.totalVoters);
        const newRemainingVoters = prev.totalVoters - newVotedCount;
        const newCompletionPercentage = Math.round(
          (newVotedCount / prev.totalVoters) * 100
        );

        const newVoter = {
          id: `voter-${Date.now()}`,
          name: `Voter ${Math.floor(Math.random() * 1000)}`,
          voterId: `VOTER${Math.floor(Math.random() * 10000)}`,
          votedAt: new Date(),
        };

        return {
          ...prev,
          votedCount: newVotedCount,
          remainingVoters: newRemainingVoters,
          completionPercentage: newCompletionPercentage,
          recentVoters: [newVoter, ...prev.recentVoters.slice(0, 2)],
        };
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [electionStatus]);

  const updateStats = () => {
    // Update stats logic here
  };

  return (
    <ElectionContext.Provider
      value={{
        stats,
        electionStatus,
        timeRemaining,
        isDemo,
        setIsDemo,
        updateStats,
      }}
    >
      {children}
    </ElectionContext.Provider>
  );
};

export const useElection = () => {
  const context = useContext(ElectionContext);
  if (context === undefined) {
    throw new Error("useElection must be used within an ElectionProvider");
  }
  return context;
};
