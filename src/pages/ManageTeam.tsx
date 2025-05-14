
import React, { useState } from "react";
import { TherapyLayout } from "@/components/layout/TherapyLayout";
import { Button } from "@/components/ui/button";
import { PlusCircle, Copy, Mail, UserPlus } from "lucide-react";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

type TeamMember = {
  id: string;
  name: string;
  position: string;
  accessLevel: "Viewer" | "Editor" | "Admin";
};

export default function ManageTeam() {
  const { toast } = useToast();
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [inviteType, setInviteType] = useState<"TeamMember" | "Caregiver">("TeamMember");
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [inviteCode, setInviteCode] = useState("");
  
  // Form state
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  // Mock data - in a real app this would come from an API
  const teamMembers: TeamMember[] = [
    {
      id: "1",
      name: "Dr. Jane Smith",
      position: "Therapist",
      accessLevel: "Admin"
    },
    {
      id: "2",
      name: "John Doe",
      position: "Mom",
      accessLevel: "Editor"
    },
    {
      id: "3",
      name: "Dr. Mike Johnson",
      position: "Pediatrician",
      accessLevel: "Viewer"
    },
    {
      id: "4",
      name: "Sarah Williams",
      position: "Dietitian",
      accessLevel: "Editor"
    },
    {
      id: "5",
      name: "Robert Brown",
      position: "Dad",
      accessLevel: "Viewer"
    },
    {
      id: "6",
      name: "Emily Davis",
      position: "Occupational Therapist",
      accessLevel: "Editor"
    }
  ];

  const generateInviteCode = () => {
    // In a real app, this would be generated on the server
    return Math.random().toString(36).substring(2, 10).toUpperCase();
  };

  const handleInvite = (type: "TeamMember" | "Caregiver") => {
    setInviteType(type);
    setInviteCode(generateInviteCode());
    setShowEmailForm(false);
    setInviteDialogOpen(true);
  };

  const copyInviteCode = () => {
    navigator.clipboard.writeText(inviteCode);
    toast({
      title: "Copied to clipboard",
      description: "Invite code has been copied to clipboard."
    });
  };

  const handleSendEmailClick = () => {
    setShowEmailForm(true);
  };

  const handleSendInvite = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would send an email via API
    toast({
      title: "Invite sent",
      description: `Invitation sent to ${email}`
    });
    setInviteDialogOpen(false);
    setFirstName("");
    setEmail("");
    setMessage("");
  };

  return (
    <TherapyLayout>
      <div className="container mx-auto py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Manage Team</h1>
          <div className="flex gap-4">
            <Button onClick={() => handleInvite("TeamMember")} className="flex items-center gap-2">
              <UserPlus size={18} />
              Invite Team Member
            </Button>
            <Button onClick={() => handleInvite("Caregiver")} className="flex items-center gap-2">
              <PlusCircle size={18} />
              Invite Caregiver
            </Button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Position</TableHead>
                <TableHead>Access Level</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {teamMembers.map((member) => (
                <TableRow key={member.id} className={member.accessLevel === "Admin" ? "bg-muted/20" : ""}>
                  <TableCell className="font-medium">{member.name}</TableCell>
                  <TableCell>{member.position}</TableCell>
                  <TableCell>
                    <span 
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        member.accessLevel === "Admin" 
                          ? "bg-blue-100 text-blue-800" 
                          : member.accessLevel === "Editor" 
                            ? "bg-green-100 text-green-800" 
                            : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {member.accessLevel}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <Dialog open={inviteDialogOpen} onOpenChange={setInviteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {inviteType === "TeamMember" ? "Invite Team Member" : "Invite Caregiver"}
            </DialogTitle>
            <DialogDescription>
              {!showEmailForm ? 
                "Share this invite code or send it directly via email." : 
                "Send an invitation directly to their email."
              }
            </DialogDescription>
          </DialogHeader>
          
          {!showEmailForm ? (
            <div className="space-y-4 py-4">
              <div className="flex items-center space-x-2">
                <div className="bg-muted p-3 rounded-md flex-1 font-mono text-sm">
                  {inviteCode}
                </div>
                <Button variant="outline" size="icon" onClick={copyInviteCode}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <Button 
                className="w-full flex items-center justify-center gap-2" 
                onClick={handleSendEmailClick}
              >
                <Mail className="h-4 w-4" />
                Send Invite Through Email
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSendInvite} className="space-y-4 py-4">
              <div className="space-y-2">
                <label htmlFor="firstName" className="text-sm font-medium">
                  First Name
                </label>
                <Input
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Enter recipient's first name"
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter recipient's email"
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium">
                  Custom Message
                </label>
                <Textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Add a personal message (optional)"
                  rows={3}
                />
              </div>
              <Button type="submit" className="w-full">
                Send Invite
              </Button>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </TherapyLayout>
  );
}
