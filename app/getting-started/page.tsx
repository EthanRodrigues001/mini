"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { updateUserProfile } from "@/actions/auth";
import { useUser } from "@/contexts/UserContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

const departments = [
  "computer",
  "extc",
  "it",
  "mechanical",
  "civil",
  "electronics",
] as const;

const clubs = [
  "NSS",
  "GDSC",
  "Algozenith",
  "AI/DL",
  "CSI-COMP",
  "CSI-IT",
  "IEEE",
  "FCRIT Council",
  "ECELL",
  "Manthan",
  "AGNEL CYBER CELL",
  "ECO CLUB",
  "DEBATE CLUB",
  "RHYTHM Club",
  "Agnel Robotics Club",
  "The drama house fcrit",
  "Nritya Nation",
] as const;

export default function GettingStartedForm() {
  const router = useRouter();
  const { user, refreshUser } = useUser();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    role: "student",
    rollNo: "",
    department: "",
    semester: "",
    phoneNo: "",
    collegeEmail: "",
    club: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        role: user.role || "student",
        rollNo: user.rollNo || "",
        department: user.department || "",
        semester: user.semester?.toString() || "",
        phoneNo: user.phoneNo || "",
        collegeEmail: user.collegeEmail || "",
        club: user.club || "",
      });
    }
  }, [user]);

  const handleChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    if (!user) {
      toast.error("User not found. Please sign in again.");
      return;
    }

    try {
      const result = await updateUserProfile(user.id, {
        role: formData.role as "student" | "organizer",
        rollNo: formData.rollNo,
        department: formData.department as (typeof departments)[number],
        semester: formData.semester
          ? Number.parseInt(formData.semester)
          : undefined,
        phoneNo: formData.phoneNo,
        collegeEmail: formData.collegeEmail,
        club:
          formData.role === "organizer"
            ? (formData.club as (typeof clubs)[number])
            : undefined,
      });

      if (result.success && result.user) {
        await refreshUser();

        toast.success("Your profile has been updated successfully.");
        router.push("/dashboard");
      } else {
        toast.error(
          result.error || "An error occurred while updating the profile."
        );
      }
    } catch {
      toast.error("An unexpected error occurred.");
    }
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  if (!user) {
    return <div>Loading...</div>;
  }

  if (user.department && user.collegeEmail) {
    return <div>Profile already completed. Redirecting to dashboard...</div>;
  }

  return (
    <div className="container mx-auto p-4 max-w-md">
      <Card>
        <CardHeader>
          <CardTitle>Complete Your Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <Progress value={(step / 3) * 100} className="mb-4" />
          {step === 1 && (
            <div className="space-y-4">
              <Label>Select your role</Label>
              <RadioGroup
                value={formData.role}
                onValueChange={(value) => handleChange("role", value)}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="student" id="student" />
                  <Label htmlFor="student">Student</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="organizer" id="organizer" />
                  <Label htmlFor="organizer">Organizer</Label>
                </div>
              </RadioGroup>
            </div>
          )}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="rollNo">Roll Number</Label>
                <Input
                  id="rollNo"
                  value={formData.rollNo}
                  onChange={(e) => handleChange("rollNo", e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="department">Department</Label>
                <Select
                  value={formData.department}
                  onValueChange={(value) => handleChange("department", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept} value={dept}>
                        {dept.charAt(0).toUpperCase() + dept.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="semester">Semester</Label>
                <Input
                  id="semester"
                  type="number"
                  value={formData.semester}
                  onChange={(e) => handleChange("semester", e.target.value)}
                  required
                />
              </div>
            </div>
          )}
          {step === 3 && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="phoneNo">Phone Number</Label>
                <Input
                  id="phoneNo"
                  type="tel"
                  value={formData.phoneNo}
                  onChange={(e) => handleChange("phoneNo", e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="collegeEmail">College Email</Label>
                <Input
                  id="collegeEmail"
                  type="email"
                  value={formData.collegeEmail}
                  onChange={(e) => handleChange("collegeEmail", e.target.value)}
                  required
                />
              </div>
              {formData.role === "organizer" && (
                <div>
                  <Label htmlFor="club">Club</Label>
                  <Select
                    value={formData.club}
                    onValueChange={(value) => handleChange("club", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Club" />
                    </SelectTrigger>
                    <SelectContent>
                      {clubs.map((club) => (
                        <SelectItem key={club} value={club}>
                          {club}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          {step > 1 && (
            <Button onClick={prevStep} variant="outline">
              Previous
            </Button>
          )}
          {step < 3 ? (
            <Button onClick={nextStep}>Next</Button>
          ) : (
            <Button onClick={handleSubmit}>Complete Profile</Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
