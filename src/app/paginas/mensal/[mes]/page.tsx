import { Mensal } from './mensal';

export default function MensalPage({ params }: { params: { mes: string } }) {
  return <Mensal mes={params.mes} />;
} 