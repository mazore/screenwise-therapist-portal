
import React from "react";
import { TherapyLayout } from "@/components/layout/TherapyLayout";
import { SessionTable } from "@/components/dashboard/SessionTable";

interface IndexProps {
  selectedClient?: string | null;
}

const Index = ({ selectedClient }: IndexProps) => {
  return (
    <TherapyLayout>
      {selectedClient && (
        <div>
          <div className="mb-6">
            <h1 className="text-2xl font-bold tracking-tight">Activity Logs</h1>
            <p className="text-muted-foreground">View and manage client feeding sessions</p>
          </div>
          
          <div className="flex justify-between items-center mb-4">
            <div className="text-sm text-muted-foreground">
              <span className="font-medium">Last updated:</span> Today at 2:45 PM
            </div>
          </div>
          
          <SessionTable clientId={selectedClient} />
        </div>
      )}
    </TherapyLayout>
  );
};

export default Index;
