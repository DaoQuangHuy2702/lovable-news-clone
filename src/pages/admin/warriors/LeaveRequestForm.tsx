import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { format, parse, differenceInDays } from "date-fns";
import api from "@/lib/api";

const formSchema = z.object({
    warriorId: z.string().min(1),
    startDate: z.string().min(1, "Vui lòng chọn ngày bắt đầu"),
    endDate: z.string().min(1, "Vui lòng chọn ngày kết thúc"),
    location: z.string().optional(),
    status: z.enum(["PENDING", "APPROVED"]),
    notes: z.string().optional(),
});

const LeaveRequestForm = () => {
    const { id, requestId } = useParams();
    const navigate = useNavigate();
    const isEditMode = !!requestId;

    const [warrior, setWarrior] = useState<any>(null);
    const [totalDays, setTotalDays] = useState(0);
    const [loading, setLoading] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            warriorId: id || "",
            startDate: "",
            endDate: "",
            location: "",
            status: "PENDING",
            notes: "",
        },
    });

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                let currentWarriorId = id;

                // 1. If edit mode, fetch request first
                if (isEditMode && requestId) {
                    const reqRes = await api.get(`/cms/leave-requests/${requestId}`);
                    if (reqRes.data && reqRes.data.success) {
                        const req = reqRes.data.data;
                        if (req.status === "APPROVED") {
                            toast.error("Không thể sửa đơn đã duyệt");
                            navigate(-1);
                            return;
                        }

                        // Set current warrior ID from request if not in params
                        currentWarriorId = req.warriorId;

                        // Fill form
                        const start = format(parse(req.startDate, "dd/MM/yyyy", new Date()), "yyyy-MM-dd");
                        const end = format(parse(req.endDate, "dd/MM/yyyy", new Date()), "yyyy-MM-dd");

                        form.reset({
                            warriorId: req.warriorId,
                            startDate: start,
                            endDate: end,
                            location: req.location || "",
                            status: req.status,
                            notes: req.notes || "",
                        });
                    }
                }

                // 2. Fetch warrior details
                if (currentWarriorId) {
                    const warRes = await api.get(`/cms/warriors/${currentWarriorId}`);
                    if (warRes.data && warRes.data.success) {
                        setWarrior(warRes.data.data);
                        // Also ensure form has the correct warriorId if it was just a new request from params
                        if (!isEditMode) {
                            form.setValue("warriorId", currentWarriorId);
                        }
                    }
                }
            } catch (error) {
                console.error("Failed to load data:", error);
                toast.error("Không thể tải dữ liệu");
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [id, requestId, isEditMode, form, navigate]);

    // Calculate total days
    const startDate = form.watch("startDate");
    const endDate = form.watch("endDate");

    useEffect(() => {
        if (startDate && endDate) {
            const start = new Date(startDate);
            const end = new Date(endDate);
            const days = differenceInDays(end, start) + 1;
            setTotalDays(days > 0 ? days : 0);
        } else {
            setTotalDays(0);
        }
    }, [startDate, endDate]);

    async function onSubmit(values: z.infer<typeof formSchema>) {
        if (totalDays <= 0) {
            toast.error("Ngày bắt đầu phải trước hoặc bằng ngày kết thúc");
            return;
        }

        const remaining = (warrior?.totalLeaveDays || 0) - (warrior?.usedLeaveDays || 0);
        if (totalDays > remaining) {
            toast.error(`Số ngày xin nghỉ (${totalDays}) vượt quá số ngày còn lại (${remaining})`);
            return;
        }

        try {
            const submitData = {
                ...values,
                // Backend now expects warriorId directly
                warriorId: values.warriorId,
                // Backend expects dd/MM/yyyy
                startDate: format(new Date(values.startDate), "dd/MM/yyyy"),
                endDate: format(new Date(values.endDate), "dd/MM/yyyy"),
            };

            if (isEditMode) {
                await api.put(`/cms/leave-requests/${requestId}`, submitData);
                toast.success("Cập nhật đơn đi phép thành công");
            } else {
                await api.post("/cms/leave-requests", submitData);
                toast.success("Tạo đơn đi phép thành công");
            }
            navigate(`/admin/warriors/${values.warriorId}/leave`);
        } catch (error: any) {
            console.error("Submit failed:", error);
            const msg = error.response?.data?.message || "Có lỗi xảy ra";
            toast.error(msg);
        }
    }

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">
                    {isEditMode ? "Cập nhật đơn đi phép" : "Tạo mới đơn đi phép"}
                </h2>
                <Button variant="outline" onClick={() => navigate(-1)}>Huỷ</Button>
            </div>

            <div className="p-6 bg-white dark:bg-gray-800 rounded-lg border shadow-sm space-y-4">
                <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                    {loading ? (
                        <p className="text-center">Đang tải thông tin...</p>
                    ) : (
                        <>
                            <p className="font-semibold text-lg">{warrior?.name || "..."}</p>
                            <p className="text-sm text-muted-foreground">{warrior?.rank} - {warrior?.unit}</p>
                            <p className="text-sm mt-2">
                                Số ngày phép còn lại: <span className="font-bold text-green-600">{(warrior?.totalLeaveDays || 0) - (warrior?.usedLeaveDays || 0)}</span> ngày
                            </p>
                        </>
                    )}
                </div>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="startDate"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Ngày bắt đầu</FormLabel>
                                        <FormControl>
                                            <Input type="date" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="endDate"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Ngày kết thúc</FormLabel>
                                        <FormControl>
                                            <Input type="date" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-md">
                            Tổng số ngày nghỉ dự kiến: <span className="font-bold">{totalDays}</span> ngày
                        </div>

                        <FormField
                            control={form.control}
                            name="location"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Địa điểm đi phép</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Nhập địa điểm..." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="status"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Trạng thái</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Chọn trạng thái" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="PENDING">Chưa duyệt</SelectItem>
                                            <SelectItem value="APPROVED">Đã duyệt</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="notes"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Ghi chú</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="Nhập ghi chú thêm..." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button type="submit" className="w-full">
                            {isEditMode ? "Lưu thay đổi" : "Tạo đơn"}
                        </Button>
                    </form>
                </Form>
            </div>
        </div>
    );
};

export default LeaveRequestForm;
