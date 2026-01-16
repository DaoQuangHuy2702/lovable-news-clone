import { useState, useEffect, useCallback } from "react";
import api from "@/lib/api";
import { Search, XCircle, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

const LeaveManagement = () => {
    const [warriors, setWarriors] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const currentYear = new Date().getFullYear();
    const [selectedYear, setSelectedYear] = useState(currentYear);
    const years = Array.from({ length: 11 }, (_, i) => currentYear - 5 + i);

    const fetchLeaveWarriors = useCallback(async () => {
        setLoading(true);
        try {
            const params: any = {
                page: page,
                size: pageSize,
                year: selectedYear
            };
            if (searchTerm) params.name = searchTerm;

            const response = await api.get('/cms/warriors/leave-management', { params });
            if (response.data && response.data.success) {
                setWarriors(response.data.data.content);
                setTotalPages(response.data.data.totalPages);
            }
        } catch (error) {
            console.error("Failed to fetch leave warriors:", error);
            toast.error("Không thể tải danh sách đi phép");
        } finally {
            setLoading(false);
        }
    }, [searchTerm, page, pageSize, selectedYear]);

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            fetchLeaveWarriors();
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [fetchLeaveWarriors]);

    const handleClearFilters = () => {
        setSearchTerm("");
        setSelectedYear(currentYear);
        setPage(0);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Quản lý đi phép</h2>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 items-end">
                <div className="flex-1 w-full max-w-sm">
                    <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Tìm kiếm theo tên..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-8"
                        />
                    </div>
                </div>

                <div className="flex flex-wrap gap-2 w-full sm:w-auto justify-end">
                    <Select value={selectedYear.toString()} onValueChange={(val) => {
                        setSelectedYear(parseInt(val));
                        setPage(0);
                    }}>
                        <SelectTrigger className="w-[120px]">
                            <SelectValue placeholder="Chọn năm" />
                        </SelectTrigger>
                        <SelectContent>
                            {years.map(y => (
                                <SelectItem key={y} value={y.toString()}>Năm {y}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {(searchTerm || selectedYear !== currentYear) && (
                        <Button variant="ghost" onClick={handleClearFilters} className="text-muted-foreground">
                            <XCircle className="mr-2 h-4 w-4" /> Làm mới
                        </Button>
                    )}
                </div>
            </div>

            <div className="rounded-md border bg-white dark:bg-gray-800 overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="min-w-[150px]">Họ và tên</TableHead>
                            <TableHead>Cấp bậc</TableHead>
                            <TableHead>Tổng số ngày phép</TableHead>
                            <TableHead>Đã đi</TableHead>
                            <TableHead>Còn lại</TableHead>
                            <TableHead>Địa chỉ</TableHead>
                            <TableHead>Ghi chú</TableHead>
                            <TableHead className="text-right">Hành động</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={7} className="h-24 text-center">
                                    Đang tải dữ liệu...
                                </TableCell>
                            </TableRow>
                        ) : warriors.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="h-24 text-center">
                                    Không có dữ liệu quân nhân đi phép.
                                </TableCell>
                            </TableRow>
                        ) : (
                            warriors.map((warrior) => {
                                const remaining = (warrior.totalLeaveDays || 0) - (warrior.usedLeaveDays || 0);
                                return (
                                    <TableRow key={warrior.id}>
                                        <TableCell className="font-medium">{warrior.name}</TableCell>
                                        <TableCell>{warrior.rank}</TableCell>
                                        <TableCell className="text-center font-semibold text-blue-600">{warrior.totalLeaveDays}</TableCell>
                                        <TableCell className="text-center font-semibold text-orange-600">{warrior.usedLeaveDays || 0}</TableCell>
                                        <TableCell className="text-center font-semibold text-green-600">{remaining}</TableCell>
                                        <TableCell className="max-w-[200px] truncate">
                                            {[
                                                warrior.currentAddress,
                                                warrior.currentCommuneName,
                                                warrior.currentProvinceName
                                            ].filter(Boolean).join(", ") || "Chưa cập nhật"}
                                        </TableCell>
                                        <TableCell className="max-w-[200px] truncate">{warrior.notes}</TableCell>
                                        <TableCell className="text-right">
                                            <Link to={`/admin/warriors/${warrior.id}/leave`}>
                                                <Button variant="ghost" size="icon" title="Xem chi tiết">
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                            </Link>
                                        </TableCell>
                                    </TableRow>
                                );
                            })
                        )}
                    </TableBody>
                </Table>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <p className="text-sm text-muted-foreground whitespace-nowrap">
                        Hiển thị trang {page + 1} / {totalPages}
                    </p>
                    <Select value={pageSize.toString()} onValueChange={(val) => {
                        setPageSize(parseInt(val));
                        setPage(0);
                    }}>
                        <SelectTrigger className="w-[120px] h-8 text-xs">
                            <SelectValue placeholder="Số hàng" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="5">5 / trang</SelectItem>
                            <SelectItem value="10">10 / trang</SelectItem>
                            <SelectItem value="20">20 / trang</SelectItem>
                            <SelectItem value="50">50 / trang</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <Pagination className="mx-0 w-auto">
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    if (page > 0) setPage(page - 1);
                                }}
                                className={page === 0 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                            />
                        </PaginationItem>

                        {Array.from({ length: totalPages }, (_, i) => (
                            <PaginationItem key={i}>
                                <PaginationLink
                                    href="#"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setPage(i);
                                    }}
                                    isActive={page === i}
                                >
                                    {i + 1}
                                </PaginationLink>
                            </PaginationItem>
                        ))}

                        <PaginationItem>
                            <PaginationNext
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    if (page < totalPages - 1) setPage(page + 1);
                                }}
                                className={page === totalPages - 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                            />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            </div>
        </div>
    );
};

export default LeaveManagement;
