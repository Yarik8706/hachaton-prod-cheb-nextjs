"use client";

import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { IOrder } from "@/store/types";
import ProductCards from "@/components/ProductCards";
import { Card } from "@/components/ui/card";
import { timeAgo } from "@/lib/utils";
import {useOrdersStore} from "@/store/orders.store";
import CommonSpinner from "@/components/common/CommonSpinner";
import {ShowType} from "@/components/common/ProductCard";

interface OrdersHistoryProps {
  orders: IOrder[];
}

export default function OrdersHistory() {
  const {orders, isLoading} = useOrdersStore()
  
  if (isLoading) {
    return <Card className="p-4 space-y-4">
      <h2 className="text-xl font-bold mb-4">История заказов</h2>
      <CommonSpinner title={"Загрузка истории заказов..."}/>
    </Card>
  }
  
  if (!orders || orders.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-10">
        История заказов пуста
      </div>
    );
  }

  return (
    <Card className="p-4">
      <h2 className="text-xl font-bold mb-4">История заказов</h2>
      <Accordion type="single" collapsible className="space-y-2">
        {orders.map((order, index) => (
          <AccordionItem key={order.id} value={order.id}>
            <AccordionTrigger>
              <div className="flex items-center justify-between w-full">
                <span className="text-lg font-bold">Заказ #{index + 1}</span>
                <span className={order.is_active ? "text-green-600" : "text-gray-500"}>
                  {order.is_active ? "Активен" : "Завершён"}
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <ProductCards products={order.items} state={ShowType.Nothing} />
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </Card>
  );
}
