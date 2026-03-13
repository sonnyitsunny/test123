import { redirect } from 'next/navigation';

export default function StockDetailPage({ params }: { params: Promise<{ id: string }> }) {
  redirect('/trading');
}
