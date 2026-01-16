import { useState, useEffect, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import api from "@/lib/api";
import { Plus, Pencil, Trash2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

const LeaveHistory = () => {
    const { id } = useParams();
    const [warrior, setWarrior] = useState<any>(null);
    const [requests, setRequests] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const currentYear = new Date().getFullYear();
    const [selectedYear, setSelectedYear] = useState(currentYear);
    const years = Array.from({ length: 11 }, (_, i) => currentYear - 5 + i);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const [warriorRes, requestsRes] = await Promise.all([
                api.get(`/cms/warriors/${id}`, { params: { year: selectedYear } }),
                api.get(`/cms/leave-requests/warrior/${id}`, { params: { year: selectedYear } })
            ]);

            if (warriorRes.data && warriorRes.data.success) {
                setWarrior(warriorRes.data.data);
            }
            if (requestsRes.data && requestsRes.data.success) {
                setRequests(requestsRes.data.data.content);
            }
        } catch (error) {
            console.error("Failed to fetch leave history:", error);
            toast.error("Không thể tải lịch sử đi phép");
        } finally {
            setLoading(false);
        }
    }, [id, selectedYear]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleDelete = async (requestId: string) => {
        try {
            await api.delete(`/cms/leave-requests/${requestId}`);
            toast.success("Xoá đơn đi phép thành công");
            fetchData();
        } catch (error: any) {
            const msg = error.response?.data?.message || "Xoá thất bại";
            toast.error(msg);
        }
    };

    if (!warrior && !loading) return <div className="text-center py-10">Không tìm thấy thông tin quân nhân</div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link to="/admin/warriors/leave">
                        <Button variant="outline" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">Lịch sử đi phép</h2>
                        <p className="text-muted-foreground">{warrior?.name} - {warrior?.rank}</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <Select value={selectedYear.toString()} onValueChange={(val) => setSelectedYear(parseInt(val))}>
                        <SelectTrigger className="w-[120px]">
                            <SelectValue placeholder="Chọn năm" />
                        </SelectTrigger>
                        <SelectContent>
                            {years.map(y => (
                                <SelectItem key={y} value={y.toString()}>Năm {y}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Link to={`/admin/warriors/${id}/leave/new`}>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" /> Tạo mới đi phép
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800">
                    <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">Tổng số ngày phép</p>
                    <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">{warrior?.totalLeaveDays || 0}</p>
                </div>
                <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-100 dark:border-orange-800">
                    <p className="text-sm text-orange-600 dark:text-orange-400 font-medium">Đã sử dụng</p>
                    <p className="text-2xl font-bold text-orange-700 dark:text-orange-300">{warrior?.usedLeaveDays || 0}</p>
                </div>
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-100 dark:border-green-800">
                    <p className="text-sm text-green-600 dark:text-green-400 font-medium">Còn lại</p>
                    <p className="text-2xl font-bold text-green-700 dark:text-green-300">
                        {(warrior?.totalLeaveDays || 0) - (warrior?.usedLeaveDays || 0)}
                    </p>
                </div>
            </div>

            <div className="rounded-md border bg-white dark:bg-gray-800 overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Ngày bắt đầu</TableHead>
                            <TableHead>Ngày kết thúc</TableHead>
                            <TableHead>Tổng số ngày</TableHead>
                            <TableHead>Địa điểm</TableHead>
                            <TableHead>Trạng thái</TableHead>
                            <TableHead>Ghi chú</TableHead>
                            <TableHead className="text-right">Hành động</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={7} className="h-24 text-center">Đang tải...</TableCell>
                            </TableRow>
                        ) : requests.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="h-24 text-center">Chưa có đơn đi phép nào</TableCell>
                            </TableRow>
                        ) : (
                            requests.map((req) => (
                                <TableRow key={req.id}>
                                    <TableCell>{req.startDate}</TableCell>
                                    <TableCell>{req.endDate}</TableCell>
                                    <TableCell className="font-semibold">{req.totalDays}</TableCell>
                                    <TableCell>{req.location}</TableCell>
                                    <TableCell>
                                        <Badge variant={req.status === "APPROVED" ? "default" : "secondary"}>
                                            {req.status === "APPROVED" ? "Đã duyệt" : "Chưa duyệt"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="max-w-[200px] truncate" title={req.notes}>
                                        {req.notes || "-"}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end space-x-2">
                                            {req.status !== "APPROVED" && (
                                                <>
                                                    <Link to={`/admin/leave-requests/${req.id}`}>
                                                        <Button variant="ghost" size="icon" title="Chỉnh sửa">
                                                            <Pencil className="h-4 w-4" />
                                                        </Button>
                                                    </Link>
                                                    <AlertDialog>
                                                        <AlertDialogTrigger asChild>
                                                            <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700 hover:bg-red-50">
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </AlertDialogTrigger>
                                                        <AlertDialogContent>
                                                            <AlertDialogHeader>
                                                                <AlertDialogTitle>Xác nhận xoá đơn?</AlertDialogTitle>
                                                                <AlertDialogDescription>Hành động này không thể hoàn tác.</AlertDialogDescription>
                                                            </AlertDialogHeader>
                                                            <AlertDialogFooter>
                                                                <AlertDialogCancel>Huỷ</AlertDialogCancel>
                                                                <AlertDialogAction onClick={() => handleDelete(req.id)} className="bg-red-600 hover:bg-red-700">Xoá</AlertDialogAction>
                                                            </AlertDialogFooter>
                                                        </AlertDialogContent>
                                                    </AlertDialog>
                                                </>
                                            )}
                                        </div>
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

export default LeaveHistory;
