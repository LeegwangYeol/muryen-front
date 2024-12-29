"use client";

import Image from "next/image";
import { ShoppingBasket, Leaf, Apple } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Equipment() {
  return (
    <div className="min-h-screen bg-pink-50">
      <header className="bg-red-600 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Organic Strawberry Mall</h1>
          <nav>
            <Button variant="ghost" className="text-white">
              <ShoppingBasket className="mr-2 h-4 w-4" />
              장바구니
            </Button>
          </nav>
        </div>
      </header>

      <main className="container mx-auto py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Product Card 1 */}
          <Card>
            <CardHeader>
              <CardTitle>유기농 딸기 재배 키트</CardTitle>
              <CardDescription>초보자를 위한 완벽한 시작</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative w-full h-48 mb-4">
                <Image
                  src="/strawberry-kit.jpg"
                  alt="딸기 재배 키트"
                  fill
                  style={{ objectFit: "cover" }}
                />
              </div>
              <div className="flex items-center gap-2 mb-2">
                <Leaf className="text-green-500" />
                <span>100% 유기농 자재</span>
              </div>
              <p>₩49,900</p>
            </CardContent>
            <CardFooter>
              <Button className="w-full">장바구니에 담기</Button>
            </CardFooter>
          </Card>

          {/* Product Card 2 */}
          <Card>
            <CardHeader>
              <CardTitle>프리미엄 딸기 모종</CardTitle>
              <CardDescription>엄선된 최고급 품종</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative w-full h-48 mb-4">
                <Image
                  src="/strawberry-seedling.jpg"
                  alt="딸기 모종"
                  fill
                  style={{ objectFit: "cover" }}
                />
              </div>
              <div className="flex items-center gap-2 mb-2">
                <Apple className="text-red-500" />
                <span>품질 보증</span>
              </div>
              <p>₩15,900</p>
            </CardContent>
            <CardFooter>
              <Button className="w-full">장바구니에 담기</Button>
            </CardFooter>
          </Card>

          {/* Product Card 3 */}
          <Card>
            <CardHeader>
              <CardTitle>유기농 비료 세트</CardTitle>
              <CardDescription>건강한 성장을 위한 필수품</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative w-full h-48 mb-4">
                <Image
                  src="/organic-fertilizer.jpg"
                  alt="유기농 비료"
                  fill
                  style={{ objectFit: "cover" }}
                />
              </div>
              <div className="flex items-center gap-2 mb-2">
                <Leaf className="text-green-500" />
                <span>친환경 인증</span>
              </div>
              <p>₩29,900</p>
            </CardContent>
            <CardFooter>
              <Button className="w-full">장바구니에 담기</Button>
            </CardFooter>
          </Card>
        </div>
      </main>
    </div>
  );
}
