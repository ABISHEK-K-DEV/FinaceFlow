
'use client';

import type { ChangeEvent } from 'react';
import React, { useState, useRef, useEffect } from 'react'; // Added React and useEffect import
import { PageHeader } from '@/components/shared/PageHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { useAuth } from '@/hooks/useAuth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { UserCircle, Bell, Palette, ShieldCheck, KeyRound, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';
import { auth, db, storage } from '@/config/firebase';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { updateProfile } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';

export default function SettingsPage() {
  const { user } = useAuth(); 
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [displayNameInput, setDisplayNameInput] = useState(user?.displayName || '');

  // Update displayNameInput when user data changes (e.g., after initial load)
  useEffect(() => {
    if (user?.displayName) {
      setDisplayNameInput(user.displayName);
    }
  }, [user?.displayName]);


  const getInitials = (name?: string | null) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const handleSaveProfile = async () => {
    if (!user || !auth.currentUser) {
      toast({
        title: 'Error',
        description: 'User not found. Please re-login.',
        variant: 'destructive',
      });
      return;
    }

    setIsSavingProfile(true);
    let profileUpdated = false;
    let photoUpdated = false;

    try {
      // Update display name if changed
      if (displayNameInput !== user.displayName) {
        await updateProfile(auth.currentUser, { displayName: displayNameInput });
        await updateDoc(doc(db, 'users', user.uid), { displayName: displayNameInput });
        profileUpdated = true;
        toast({
          title: 'Profile Updated',
          description: 'Your display name has been updated.',
        });
      }

      // Upload and update photo if a new one is selected
      if (selectedFile) {
        const file = selectedFile;
        const sRef = storageRef(storage, `profilePictures/${user.uid}/${file.name}`);
        await uploadBytes(sRef, file);
        const downloadURL = await getDownloadURL(sRef);

        await updateProfile(auth.currentUser, { photoURL: downloadURL });
        await updateDoc(doc(db, 'users', user.uid), { photoURL: downloadURL });
        
        setPhotoPreview(downloadURL); 
        setSelectedFile(null); 
        photoUpdated = true;
        toast({
          title: 'Photo Updated',
          description: 'Your profile photo has been successfully updated.',
        });
      }

      if (!profileUpdated && !photoUpdated) {
        toast({
          title: 'No Changes',
          description: 'No changes were made to your profile.',
        });
      }
    } catch (error) {
      console.error('Failed to save profile:', error);
      toast({
        title: 'Error Saving Profile',
        description: 'Could not save your profile. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleChangePhoto = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      toast({
        title: 'Photo Selected',
        description: 'New photo previewed. Click "Save Profile" to upload and apply.',
      });
    }
    if (event.target) {
      event.target.value = '';
    }
  };

  const handleChangePassword = () => {
    console.log('Change Password clicked');
    toast({
      title: 'Password Action',
      description: 'Change Password functionality is not yet implemented.',
    });
  };
  
  return (
    <>
      <PageHeader
        title="Settings"
        description="Manage your account and application preferences."
      />

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-1 space-y-6">
           <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center"><UserCircle className="mr-2 h-5 w-5 text-primary" />Profile</CardTitle>
              <CardDescription>Update your personal information.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={photoPreview || user?.photoURL || undefined} />
                  <AvatarFallback>{getInitials(user?.displayName)}</AvatarFallback>
                </Avatar>
                <div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/png, image/jpeg, image/gif"
                    style={{ display: 'none' }}
                  />
                  <Button variant="outline" size="sm" onClick={handleChangePhoto} disabled={isSavingProfile}>Change Photo</Button>
                  <p className="text-xs text-muted-foreground mt-1">JPG, GIF or PNG. 1MB max.</p>
                </div>
              </div>
              <div>
                <Label htmlFor="displayName">Display Name</Label>
                <Input 
                  id="displayName" 
                  value={displayNameInput} 
                  onChange={(e) => setDisplayNameInput(e.target.value)} 
                  disabled={isSavingProfile}
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" defaultValue={user?.email || ''} disabled />
                 <p className="text-xs text-muted-foreground mt-1">Email cannot be changed here.</p>
              </div>
              <Button onClick={handleSaveProfile} disabled={isSavingProfile}>
                {isSavingProfile ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                {isSavingProfile ? 'Saving...' : 'Save Profile'}
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center"><KeyRound className="mr-2 h-5 w-5 text-primary" />Password</CardTitle>
              <CardDescription>Change your account password.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
               <div>
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input id="currentPassword" type="password" />
              </div>
              <div>
                <Label htmlFor="newPassword">New Password</Label>
                <Input id="newPassword" type="password" />
              </div>
               <div>
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input id="confirmPassword" type="password" />
              </div>
              <Button onClick={handleChangePassword}>Change Password</Button>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center"><Bell className="mr-2 h-5 w-5 text-primary" />Notifications</CardTitle>
              <CardDescription>Manage your notification preferences.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
                <div className="space-y-0.5">
                  <Label className="text-base">Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive updates about your account and finances.
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
                <div className="space-y-0.5">
                  <Label className="text-base">Budget Alerts</Label>
                  <p className="text-sm text-muted-foreground">
                    Get notified when you're close to exceeding a budget.
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
                <div className="space-y-0.5">
                  <Label className="text-base">Payment Reminders</Label>
                  <p className="text-sm text-muted-foreground">
                    Reminders for upcoming recurring payments.
                  </p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center"><Palette className="mr-2 h-5 w-5 text-primary" />Appearance</CardTitle>
              <CardDescription>Customize the look and feel of the app.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Theme customization (e.g., dark mode) would go here.</p>
              <Image src="https://placehold.co/600x200.png" alt="Theme settings placeholder" width={600} height={200} className="mt-4 rounded-md" data-ai-hint="theme settings ui" />
            </CardContent>
          </Card>
          
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center"><ShieldCheck className="mr-2 h-5 w-5 text-primary" />Security & Privacy</CardTitle>
              <CardDescription>Manage security settings and data preferences.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Two-factor authentication (OTP) setup and data export options would be here.</p>
              <div className="mt-4 space-y-2">
                <Button variant="outline">Enable Two-Factor Authentication (OTP)</Button>
                <Button variant="outline">Export My Data</Button>
                <Button variant="destructive">Delete Account</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
