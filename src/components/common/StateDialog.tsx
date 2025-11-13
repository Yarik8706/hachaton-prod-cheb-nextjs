"use client"

import {ReactNode, useEffect, useState} from "react";
import {
  Dialog,
  DialogClose,
  DialogContent, DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";

interface IProps {
  title: string,
  children: ReactNode,
  state: boolean,
  onCancel: () => void;
}

export default function StateDialog({title, children, state, onCancel} : IProps) {
  return (
    <Dialog open={state} onOpenChange={open => {onCancel()}}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="flex justify-center items-center gap-2">
          {children}
        </div>
      </DialogContent>
    </Dialog>
);

}