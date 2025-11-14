"use client"

import {Item, ItemContent, ItemMedia, ItemTitle} from "@/components/ui/item";
import {Spinner} from "@/components/ui/spinner";

interface IProps {
  title: string,
  variant?: 'muted' | 'default' | 'outline' | null | undefined;
}

export default function CommonSpinner({title, variant = "muted"}:IProps) {
  return (
    <Item variant={variant} className="my-1">
      <ItemMedia>
        <Spinner />
      </ItemMedia>
      <ItemContent>
        <ItemTitle className="line-clamp-1">{title}</ItemTitle>
      </ItemContent>
    </Item>
  );
  
}