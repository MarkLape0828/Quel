import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Download, FileText, FileArchive, FileBarChart } from "lucide-react";
import type { DocumentItem } from "@/lib/types";
import { Badge } from "@/components/ui/badge";

const documents: DocumentItem[] = [
  {
    id: "1",
    name: "HOA Guidelines Rev. 2024",
    url: "/documents/hoa-guidelines-2024.pdf",
    type: "guideline",
    uploadDate: "2024-01-15",
    size: "1.2 MB",
  },
  {
    id: "2",
    name: "Meeting Minutes - May 2024",
    url: "/documents/meeting-minutes-may-2024.pdf",
    type: "minutes",
    uploadDate: "2024-06-01",
    size: "350 KB",
  },
  {
    id: "3",
    name: "Architectural Change Request Form",
    url: "/documents/arc-request-form.pdf",
    type: "form",
    uploadDate: "2023-11-20",
    size: "150 KB",
  },
  {
    id: "4",
    name: "Annual Financial Report 2023",
    url: "/documents/financial-report-2023.pdf",
    type: "report",
    uploadDate: "2024-03-01",
    size: "2.5 MB",
  },
];

const getIconForType = (type: DocumentItem["type"]) => {
  switch (type) {
    case "guideline":
      return <FileText className="h-5 w-5 text-primary" />;
    case "minutes":
      return <FileArchive className="h-5 w-5 text-secondary-foreground" />;
    case "form":
      return <FileText className="h-5 w-5 text-accent-foreground" />; // Using accent color for forms
    case "report":
        return <FileBarChart className="h-5 w-5 text-primary" />;
    default:
      return <FileText className="h-5 w-5" />;
  }
};

export default function DocumentsPage() {
  return (
    <div className="space-y-6">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Document Library</CardTitle>
          <CardDescription>Access important HOA documents, guidelines, meeting minutes, and forms.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">Type</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Uploaded</TableHead>
                <TableHead>Size</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {documents.map((doc) => (
                <TableRow key={doc.id}>
                  <TableCell>{getIconForType(doc.type)}</TableCell>
                  <TableCell className="font-medium">{doc.name}</TableCell>
                  <TableCell>{new Date(doc.uploadDate).toLocaleDateString()}</TableCell>
                  <TableCell>{doc.size}</TableCell>
                  <TableCell className="text-right">
                    <Button asChild variant="outline" size="sm">
                      <a href={doc.url} download target="_blank" rel="noopener noreferrer">
                        <Download className="mr-2 h-4 w-4" /> Download
                      </a>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
