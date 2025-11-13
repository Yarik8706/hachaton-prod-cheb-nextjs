"use client";

import CommonDialog from "@/components/common/CommonDialog";
import { Button } from "@/components/ui/button";
import { useOrdersStore } from "@/store/orders.store";
import { useEffect, useMemo, useState } from "react";
import CommonSpinner from "@/components/common/CommonSpinner";
import { IOrder, IProductCardData } from "@/store/types";
import { toast } from "sonner";
import ProductCard, { ShowType } from "@/components/common/ProductCard";
import { useCartProductsStore } from "@/store/useCartProductsStore";
import ProductCards from "@/components/ProductCards";
import {useRouter} from "next/navigation";
import {useAuth} from "@/providers/AuthProvider";

interface IProps {
  card_id: string;
  allMoney: number;
}

export default function MakingOrderDialog({ card_id, allMoney }: IProps) {
  const { createOrder, payOrder, cancelOrder, isLoading, error } = useOrdersStore();
  const { products } = useCartProductsStore();
  const router = useRouter()
  const {tokenUpdate} = useAuth()
  
  const [order, setOrder] = useState<IOrder | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleDialogOpen = async () => {
    setIsDialogOpen(true);
    try {
      const orderData = await createOrder(card_id);
      setOrder(orderData);
    } catch (e) {
      toast.error("Ошибка при создании заказа");
    }
  };

  const onSubmit = async () => {
    if (!order) return;
    router.push("/home")
    toast.success("Заказ успешно оплачен!");
    tokenUpdate()
    setIsDialogOpen(false)
  };

  const onCancel = async () => {
    if (!order) return;
    await cancelOrder(order.id);
    toast("Заказ успешно отменен!");
    tokenUpdate()
    setIsDialogOpen(false)
  };
  
  const groupedProducts = useMemo(() => {
    const map = new Map<string, IProductCardData[]>();

    products.forEach((product) => {
      const partnerName = product.partner?.name || "Без партнёра";
      if (!map.has(partnerName)) map.set(partnerName, []);
      map.get(partnerName)!.push(product);
    });

    return Array.from(map.entries());
  }, [products]);

  return (
    <CommonDialog
      open={isDialogOpen}
      onOpenChange={ (v) => {setIsDialogOpen(v); if (!v) tokenUpdate()}}
      title="Оформление заказа"
      dialogTrigger={
        <div
          className="w-full block mt-4 bg-[var(--main-color)] py-2 px-3 rounded-xl hover:bg-[var(--main-color-hover)]" 
          style={{
            cursor: allMoney == 0 ? "not-allowed" : "pointer",
            opacity: allMoney == 0 ? 0.5 : 1
          }}
          onClick={handleDialogOpen}>
          <div>
            Оплатить {allMoney}₽
          </div>
        </div>
      }
    >
      {isLoading ? (
        <CommonSpinner title="Загрузка..." />
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className="space-y-4">
          {/* === товары по партнёрам === */}
          {groupedProducts.length > 0 ? (
            groupedProducts.map(([partnerName, partnerProducts]) => (
              <div key={partnerName} className="rounded-lg space-y-2">
                <div className="font-semibold text-lg">{partnerName}</div>
                <ProductCards groupDuplicates={true} className="lg:grid-cols-3" products={partnerProducts} state={ShowType.Nothing} />
                <div className="w-full h-[1px] bg-gray-200"></div>
              </div>
            ))
          ) : (
            <p className="text-gray-500">Корзина пуста</p>
          )}

          {/* === действия === */}
          <div className="flex gap-2 justify-end pt-2 border-t">
            <Button onClick={onSubmit}>Оплатить {allMoney}₽</Button>
            <Button variant="secondary" onClick={onCancel}>
              Отменить
            </Button>
          </div>
        </div>
      )}
    </CommonDialog>
  );
}
