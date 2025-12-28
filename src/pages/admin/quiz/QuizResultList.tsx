import { useState, useEffect } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/api";
import { format } from "date-fns";

const QuizResultList = () => {
    const [results, setResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchResults = async () => {
        try {
            const response = await api.get("/cms/quiz-results");
            if (response.data && response.data.data) {
                setResults(response.data.data.content);
            }
        } catch (error) {
            console.error("Failed to fetch results:", error);
            toast.error("Không thể tải danh sách kết quả.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchResults();
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm("Bạn có chắc chắn muốn xóa kết quả này?")) return;

        try {
            await api.delete(`/cms/quiz-results/${id}`);
            toast.success("Xóa thành công!");
            fetchResults();
        } catch (error) {
            console.error("Delete failed:", error);
            toast.error("Xóa thất bại.");
        }
    };

    if (loading) return <div>Đang tải...</div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Quản lý kết quả cuộc thi</h2>
            </div>

            <div className="rounded-md border bg-white dark:bg-gray-800">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Họ và tên</TableHead>
                            <TableHead>Cấp bậc</TableHead>
                            <TableHead>Đơn vị</TableHead>
                            <TableHead>Điểm số</TableHead>
                            <TableHead>Thời gian</TableHead>
                            <TableHead>Ngày thi</TableHead>
                            <TableHead className="text-right">Thao tác</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {results.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
                                    Chưa có kết quả nào.
                                </TableCell>
                            </TableRow>
                        ) : (
                            results.map((result) => (
                                <TableRow key={result.id}>
                                    <TableCell>
                                        <div className="font-medium">{result.name}</div>
                                        <div className="text-xs text-muted-foreground">{result.phoneNumber}</div>
                                    </TableCell>
                                    <TableCell>{result.rank}</TableCell>
                                    <TableCell>{result.unit}</TableCell>
                                    <TableCell className="font-bold text-primary">{result.score}</TableCell>
                                    <TableCell>{result.completionTime}s</TableCell>
                                    <TableCell>
                                        {result.createdAt ? format(new Date(result.createdAt), "dd/MM/yyyy HH:mm") : "-"}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                            onClick={() => handleDelete(result.id)}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

export default QuizResultList;
