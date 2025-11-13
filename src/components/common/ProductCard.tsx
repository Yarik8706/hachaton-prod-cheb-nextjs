"use client";

import Image from "next/image";
import { Button } from "../../../../hackaton-prod-spb-nextjs/src/components/ui/button";
import { timeAgo } from "../../../../hackaton-prod-spb-nextjs/src/lib/utils";
import { IPartner } from "../../../../hackaton-prod-spb-nextjs/src/store/types";
import Link from "next/link";

export enum ShowType {
  Nothing,
  AddToCart,
  BothAddAndDeleteCart,
}

interface ProductCardProps {
  title: string;
  image: string;
  cost: number;
  showType: ShowType;
  onAdd: (id: string) => void;
  onDelete: (id: string) => void;
  id: string;
  time_delivery: string;
  partner: IPartner;
}

export default function ProductCard({
                                      title,
                                      image,
                                      cost,
                                      id,
                                      onAdd,
                                      onDelete,
                                      showType = ShowType.AddToCart,
                                      time_delivery,
                                      partner,
                                    }: ProductCardProps) {
  return (
    <div>
      <Link href={`/home/product/${id}`} className="block">
        <div className="w-full transition-shadow">
          {/* Картинка товара */}
          <div className="relative w-full aspect-square">
            <Image
              src={image}
              alt={title}
              fill
              className="rounded-3xl cursor-pointer
              object-cover shadow-sm hover:shadow-md hover:scale-105 transition-all duration-300"
            />

            {(showType === ShowType.AddToCart ||
              showType === ShowType.BothAddAndDeleteCart) && (
              <Button
                size="icon"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onAdd(id);
                }}
                className="absolute right-2 bottom-2 rounded-xl text-black shadow-md h-[44px] w-[44px] text-xl"
              >
                +
              </Button>
            )}

            {showType === ShowType.BothAddAndDeleteCart && (
              <Button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onDelete(id);
                }}
                className="absolute left-2 bottom-2 rounded-xl text-black shadow-md text-xl h-[44px] w-[44px]"
              >
                -
              </Button>
            )}
          </div>
        </div>
        <div className="py-1 text-sm overflow-hidden text-nowrap text-ellipsis block min-w-0">
          <div className="flex items-baseline gap-1 justify-between overflow-hidden text-nowrap text-ellipsis min-w-0">
            <span className="text-red-600 font-semibold text-base">
              {cost}₽
            </span>
            <span className="text-gray-600 font-semibold text-base">
              {partner.name}
            </span>
          </div>
          <div className="leading-tight text-gray-800 text-lg font-bold overflow-hidden text-nowrap text-ellipsis">
            {title}
          </div>
          <span>Доставка: {timeAgo(time_delivery)}</span>
        </div>
      </Link>
    </div>
  );
}
