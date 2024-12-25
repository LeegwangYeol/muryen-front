import RecordGraph from "../component/record-graph";

export default function Daily() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">User Activity Record</h1>
      <RecordGraph />
    </div>
  );
}
