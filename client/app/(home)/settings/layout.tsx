"use client"
import React, { useState } from 'react'
import { cn } from "@/lib/utils"
import { Separator } from '@/components/ui/separator'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Moon, Sun, Settings } from 'lucide-react'
import { useTheme } from 'next-themes'

function settingsLayout({children}:{
    children:React.ReactNode
}) {
    const [activeTab, setActiveTab] = useState("profile")
    const {theme, setTheme} = useTheme()
  return (
    <div>
        <div>
            <h1 className='text-3xl'>Settings</h1>
        </div>
        
        <div className="flex flex-row justify-center">
            <div className="w-[20rem] p-4">
                <div
                className={cn(
                    "mt-1 mb-1 focus:bg-accent focus:text-accent-foreground data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 dark:data-[variant=destructive]:focus:bg-destructive/20 data-[variant=destructive]:focus:text-destructive data-[variant=destructive]:*:[svg]:!text-destructive [&_svg:not([class*='text-'])]:text-muted-foreground relative flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-xl outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[inset]:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 font-bold ",
                    activeTab==="profile"?"bg-gray-500":"hover:bg-gray-400")}
                    onClick={()=> setActiveTab("profile")}
                >
                Profile
                </div>
                <div
                className={cn(
                    "mt-1 mb-1 focus:bg-accent focus:text-accent-foreground data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 dark:data-[variant=destructive]:focus:bg-destructive/20 data-[variant=destructive]:focus:text-destructive data-[variant=destructive]:*:[svg]:!text-destructive [&_svg:not([class*='text-'])]:text-muted-foreground relative flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-xl outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[inset]:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 font-bold ",
                    activeTab==="account"?"bg-gray-500":"hover:bg-gray-400")}
                    onClick={()=> setActiveTab("account")}
                >
                Account
                </div>
                <div
                className={cn(
                    "mt-1 mb-1 focus:bg-accent focus:text-accent-foreground data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 dark:data-[variant=destructive]:focus:bg-destructive/20 data-[variant=destructive]:focus:text-destructive data-[variant=destructive]:*:[svg]:!text-destructive [&_svg:not([class*='text-'])]:text-muted-foreground relative flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-xl outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[inset]:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 font-bold ",
                    activeTab==="appearance"?"bg-gray-500":"hover:bg-gray-400")}
                    onClick={()=> setActiveTab("appearance")}
                >
                Appearance
                </div>
            </div>
            <div className="flex-1 pt-4 pb-4">
            {activeTab === "profile" && (
              <>
                <div className="space-y-1">
                  <h2 className="text-xl font-bold">Profile</h2>
                  <p className="text-sm text-gray-400">This is how others will see you on the site.</p>
                </div>

                <Separator className="my-6 bg-gray-800" />

                <div className="space-y-6">
                  <div className="space-y-2">
                    <label htmlFor="username" className="text-sm font-medium">
                      Username
                    </label>
                    <Input id="username" placeholder="nl1c" className=" border-gray-800" />
                    <p className="text-xs text-gray-400">
                      This is your public display name. It can be your real name or a pseudonym.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="bio" className="text-sm font-medium">
                      Bio
                    </label>
                    <Textarea
                      id="bio"
                      placeholder="I love Lumiere!"
                      className="border-gray-800 min-h-[80px]"
                    />
                    <p className="text-xs text-gray-400">
                      Showcase how much of a movie buff you are!
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="avatar" className="text-sm font-medium">
                      Avatar
                    </label>
                    <Input id="avatar" placeholder="https://" className=" border-gray-800" />
                    <p className="text-xs text-gray-400">
                      Place the URL for your profile picture here.
                    </p>
                  </div>

                  <div className="flex flex-row justify-between">
                    <div className="space-y-2 w-[28rem] ">
                        <label htmlFor="firstname" className="text-sm font-medium">
                        First Name
                        </label>
                        <Input id="firstname" placeholder="nl1" className=" border-gray-800" />
                        <p className="text-xs text-gray-400">
                        This is your first name.
                        </p>
                    </div>

                    <div className="space-y-2 w-[28rem]">
                        <label htmlFor="lastname" className="text-sm font-medium">
                        Last Name
                        </label>
                        <Input id="lastname" placeholder="c" className=" border-gray-800" />
                        <p className="text-xs text-gray-400">
                        This is your last name.
                        </p>
                    </div>
                  </div>

                  <Button>Update profile</Button>
                </div>
              </>
            )} 

            {activeTab === "account" && (
              <>
                <div className="space-y-1">
                  <h2 className="text-xl font-bold">Account</h2>
                  <p className="text-sm text-gray-400">Update your account settings.</p>
                </div>

                <Separator className="my-6 bg-gray-800" />

                <div className="space-y-6">
                  <div className="space-y-2 flex flex-col">
                    <label htmlFor="email" className="text-sm font-medium">
                      Email
                    </label>
                    <label htmlFor="fetchedEmail" className="text-sm font-medium">
                      nl1c@adelaide.edu.au
                    </label>
                  </div>

                  <div className="flex flex-row justify-between">
                    <div className="space-y-2 w-[28rem] ">
                        <label htmlFor="newPassword" className="text-sm font-medium">
                        New Password
                        </label>
                        <Input id="newPassword" placeholder="New Password" className=" border-gray-800" />
                        <p className="text-xs text-gray-400">
                        Enter your new password.
                        </p>
                    </div>

                    <div className="space-y-2 w-[28rem]">
                        <label htmlFor="confirmPassword" className="text-sm font-medium">
                        Confirm New Password
                        </label>
                        <Input id="confirmPassword" placeholder="Confirm New Password" className=" border-gray-800" />
                        <p className="text-xs text-gray-400">
                        Re-enter your new password.
                        </p>
                    </div>
                  </div>

                  <Button>Set Password</Button>
                </div>
              </>
            )} 
            {activeTab === "appearance" && (
              <>
                <div className="space-y-1">
                  <h2 className="text-xl font-bold">Appearance</h2>
                  <p className="text-sm text-gray-400">Customize the appearance of Lumiere</p>
                </div>

                <Separator className="my-6 bg-gray-800" />

                <div className="space-y-6">
                  <div className="space-y-2 flex flex-col">
                    <label htmlFor="email" className="text-sm font-medium">
                      Theme
                    </label>
                    <RadioGroup defaultValue="dark" className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <RadioGroupItem value="light" id="light" className="peer sr-only" />
                        <Label
                          htmlFor="light"
                          className={cn("flex flex-col items-center justify-between rounded-md border-2 border-gray-500  p-4 hover:bg-gray-800 hover:border-gray-700 ",theme==='light'?'border-black':'hover:bg-gray-400')}
                          onClick={()=>setTheme('light')}
                        >
                          <Sun className="mb-3 h-6 w-6" />
                          <span className="text-sm font-medium">Light</span>
                        </Label>
                      </div>
                      <div>
                        <RadioGroupItem value="dark" id="dark" className="peer sr-only" />
                        <Label
                          htmlFor="dark"
                          className={cn("flex flex-col items-center justify-between rounded-md border-2 border-gray-500  p-4 hover:bg-gray-800 hover:border-gray-700 ",theme==='dark'?'border-white':'hover:bg-gray-400')}
                          onClick={()=>setTheme('dark')}
                        >
                          <Moon className="mb-3 h-6 w-6" />
                          <span className="text-sm font-medium">Dark</span>
                        </Label>
                      </div>
                      <div>
                        <RadioGroupItem value="system" id="system" className="peer sr-only" />
                        <Label
                          htmlFor="system"
                          className={cn("flex flex-col items-center justify-between rounded-md border-2 border-gray-500  p-4 hover:bg-gray-800 hover:border-gray-700 ")}
                          onClick={()=>setTheme('system')}
                        >
                          <Settings className="mb-3 h-6 w-6" />
                          <span className="text-sm font-medium">System</span>
                        </Label>
                      </div>
                    </RadioGroup>
                    <p className="text-xs text-gray-400">Select the theme for the dashboard.</p>
                  </div>

                  
                </div>
              </>
            )} 
            </div>
        </div>


    {children}
    </div>
  )
}

export default settingsLayout