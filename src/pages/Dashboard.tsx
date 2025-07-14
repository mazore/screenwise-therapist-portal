import React from "react";
import { TherapyLayout } from "@/components/layout/TherapyLayout";
import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { SessionTable } from "@/components/dashboard/SessionTable";
import { ClientOverview } from "@/components/dashboard/ClientOverview";
import { useClientData } from "@/hooks/useClientData";

// Updated mock data to match dropdown clients
const mockClients = [
	{
		id: "client-1",
		name: "Client #1",
		lastLogDate: "Today, 2:30 PM",
		logsLast7Days: 12,
		mainGoal: {
			type: "Bites per Meal",
			current: 8,
			starting: 3,
			target: 15,
			displayUnit: "/meal",
		},
	},
	{
		id: "client-3",
		name: "Client #3",
		lastLogDate: "Today, 12:45 PM",
		logsLast7Days: 10,
		mainGoal: {
			type: "Refusal to Accept Food",
			current: 6,
			starting: 12,
			target: 2,
			displayUnit: "/week",
		},
	},
	{
		id: "client-8",
		name: "Client #8",
		lastLogDate: "4 days ago",
		logsLast7Days: 8,
		mainGoal: {
			type: "Duration",
			current: 25,
			starting: 45,
			target: 20,
			displayUnit: "min",
		},
	},
	{
		id: "client-12",
		name: "Client #12",
		lastLogDate: "Today, 12:10 PM",
		logsLast7Days: 10,
		mainGoal: {
			type: "Refusal to Accept Food",
			current: 4,
			starting: 8,
			target: 1,
			displayUnit: "/week",
		},
	},
];

const Dashboard = () => {
	const { therapistData, allClients } = useClientData(); // Access therapistData and allClients

	const totalClients = allClients ? Object.keys(allClients).length : 0;

	// Calculate inactive clients
	const inactiveClients = allClients
		? Object.values(allClients).filter((client: any) => {
			const mealHistory = client.mealHistory || [];
			const threeDaysAgo = Date.now() - 3 * 24 * 60 * 60 * 1000; // 3 days in milliseconds

			const hasRecentLog = mealHistory.some((log: any) => {
				const logTime = log.mealStartTime; // already in milliseconds
				return logTime >= threeDaysAgo;
			});

			const isInactive = mealHistory.length === 0 || !hasRecentLog;
			return isInactive; // Inactive if no logs or no recent logs
		}).length
		: 0;

	// Get therapist name from therapistData
	const therapistName = therapistData?.firstName || "Therapist";

	return (
		<TherapyLayout>
			<div className="space-y-6">
				<div>
					<h1 className="text-2xl font-bold tracking-tight"> Welcome back, {therapistName}</h1>
					<p className="text-muted-foreground"> Here's an overview of all your client activity.</p>
				</div>

				<DashboardStats totalClients={totalClients} inactiveClients={inactiveClients} />
				{/* <ClientOverview clients={mockClients} /> */}

				<div className="w-full">
					<SessionTable clientId={null} /> {/* Ensure clientId is null to show all logs */}
				</div>
				{/* <div className="w-full">
          <RecentActivity />
        </div> */}
			</div>
		</TherapyLayout>
	);
};

export default Dashboard;
