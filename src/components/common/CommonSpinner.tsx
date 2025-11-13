"use client"

import {Item, ItemContent, ItemMedia, ItemTitle} from "@/components/ui/item";
import {Spinner} from "@/components/ui/spinner";

interface IProps {
  title: string
}

export default function CommonSpinner({title}:IProps) {

  return (
    <Item variant="muted" className="my-1">
      <ItemMedia>
        <Spinner />
      </ItemMedia>
      <ItemContent>
        <ItemTitle className="line-clamp-1">{title}</ItemTitle>
      </ItemContent>
    </Item>
  );
  
}