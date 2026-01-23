import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm, useFieldArray, Controller } from "react-hook-form";
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
import { Trash2, PlusCircle, ArrowLeft, Trophy } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/api";

const formSchema = z.object({
    title: z.string().min(2, {
        message: "Tiêu đề phải có ít nhất 2 ký tự.",
    }),
    description: z.string().optional(),
    isActive: z.boolean().default(false),
    questions: z.array(z.object({
        content: z.string().min(1, "Vui lòng nhập nội dung câu hỏi"),
        options: z.array(z.object({
            content: z.string().min(1, "Vui lòng nhập nội dung đáp án"),
            isCorrect: z.boolean().default(false),
        })).min(2, "Mỗi câu hỏi phải có ít nhất 2 đáp án")
    })).min(1, "Phải có ít nhất 1 câu hỏi")
});

const QuizForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = !!id;

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            description: "",
            isActive: false,
            questions: [
                {
                    content: "",
                    options: [
                        { content: "", isCorrect: true },
                        { content: "", isCorrect: false },
                        { content: "", isCorrect: false },
                        { content: "", isCorrect: false },
                    ]
                }
            ],
        },
    });

    const { fields: questionFields, append: appendQuestion, remove: removeQuestion } = useFieldArray({
        control: form.control,
        name: "questions",
    });

    useEffect(() => {
        const fetchQuiz = async () => {
            if (isEditMode && id) {
                try {
                    const response = await api.get(`/cms/quizzes/${id}`);
                    if (response.data && response.data.success) {
                        const data = response.data.data;

                        if (data.isActive) {
                            toast.warning("Không thể chỉnh sửa bộ câu hỏi đang hoạt động. Vui lòng hủy kích hoạt trước.");
                            navigate("/admin/quizzes");
                            return;
                        }

                        form.reset({
                            title: data.title,
                            description: data.description || "",
                            isActive: data.isActive,
                            questions: data.questions.map((q: any) => ({
                                content: q.content,
                                options: q.options.map((o: any) => ({
                                    content: o.content,
                                    isCorrect: o.isCorrect
                                }))
                            }))
                        });
                    }
                } catch (error) {
                    console.error("Failed to fetch quiz:", error);
                    toast.error("Không tìm thấy bộ câu hỏi");
                    navigate("/admin/quizzes");
                }
            }
        };

        fetchQuiz();
    }, [isEditMode, id, navigate]);

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            if (isEditMode) {
                await api.put(`/cms/quizzes/${id}`, values);
                toast.success("Cập nhật bộ câu hỏi thành công!");
            } else {
                await api.post("/cms/quizzes", values);
                toast.success("Tạo bộ câu hỏi thành công!");
            }
            navigate("/admin/quizzes");
        } catch (error) {
            console.error("Quiz save failed:", error);
            toast.error("Lỗi khi lưu bộ câu hỏi");
        }
    }

    const addQuestion = () => {
        appendQuestion({
            content: "",
            options: [
                { content: "", isCorrect: true },
                { content: "", isCorrect: false },
                { content: "", isCorrect: false },
                { content: "", isCorrect: false },
            ]
        });
    };

    return (
        <div className="space-y-6 pb-20 max-w-4xl mx-auto">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => navigate("/admin/quizzes")}>
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <h2 className="text-3xl font-bold tracking-tight">
                    {isEditMode ? "Chỉnh sửa bộ câu hỏi" : "Tạo bộ câu hỏi mới"}
                </h2>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <div className="bg-card rounded-xl border p-6 shadow-sm space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                                control={form.control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem className="md:col-span-2">
                                        <FormLabel>Tiêu đề bộ câu hỏi</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Nhập tiêu đề cuộc thi..." {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem className="md:col-span-2">
                                        <FormLabel>Mô tả</FormLabel>
                                        <FormControl>
                                            <Textarea placeholder="Nhập mô tả ngắn về cuộc thi..." {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="isActive"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                        <FormControl>
                                            <input
                                                type="checkbox"
                                                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                                checked={field.value}
                                                onChange={field.onChange}
                                            />
                                        </FormControl>
                                        <div className="space-y-1 leading-none">
                                            <FormLabel>Kích hoạt ngay</FormLabel>
                                            <p className="text-xs text-muted-foreground">
                                                Khi được kích hoạt, bộ câu hỏi này sẽ hiển thị ở trang cuộc thi phía người dùng.
                                            </p>
                                        </div>
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-xl font-semibold flex items-center gap-2">
                                <Trophy className="w-5 h-5 text-primary" />
                                Danh sách câu hỏi
                            </h3>
                            <Button type="button" variant="outline" size="sm" onClick={addQuestion} className="gap-2">
                                <PlusCircle className="w-4 h-4" />
                                Thêm câu hỏi
                            </Button>
                        </div>

                        {questionFields.map((qField, qIndex) => (
                            <div key={qField.id} className="bg-card rounded-xl border p-6 shadow-sm space-y-6 relative group">
                                <div className="absolute -top-3 -right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Button
                                        type="button"
                                        variant="destructive"
                                        size="icon"
                                        className="h-8 w-8 rounded-full shadow-lg"
                                        onClick={() => removeQuestion(qIndex)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>

                                <FormField
                                    control={form.control}
                                    name={`questions.${qIndex}.content`}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-base font-bold text-primary">Câu hỏi {qIndex + 1}</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Nhập nội dung câu hỏi..." {...field} className="text-lg" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-4 border-l-2 border-primary/20">
                                    {[0, 1, 2, 3].map((oIndex) => (
                                        <div key={oIndex} className="flex items-start gap-3">
                                            <div className="flex flex-col items-center gap-2 mt-2">
                                                <span className="text-xs font-bold text-muted-foreground">{String.fromCharCode(65 + oIndex)}</span>
                                                <FormField
                                                    control={form.control}
                                                    name={`questions.${qIndex}.options.${oIndex}.isCorrect`}
                                                    render={({ field }) => (
                                                        <input
                                                            type="checkbox"
                                                            checked={field.value}
                                                            onChange={(e) => {
                                                                const checked = e.target.checked;
                                                                // Ensure only one checkbox is checked per question
                                                                if (checked) {
                                                                    const questions = form.getValues("questions");
                                                                    questions[qIndex].options.forEach((opt, idx) => {
                                                                        opt.isCorrect = idx === oIndex;
                                                                    });
                                                                    form.setValue("questions", questions);
                                                                }
                                                            }}
                                                            className="h-5 w-5 rounded-full border-gray-300 text-green-600 focus:ring-green-600"
                                                        />
                                                    )}
                                                />
                                            </div>
                                            <FormField
                                                control={form.control}
                                                name={`questions.${qIndex}.options.${oIndex}.content`}
                                                render={({ field }) => (
                                                    <FormItem className="flex-1">
                                                        <FormControl>
                                                            <Input placeholder={`Đáp án ${String.fromCharCode(65 + oIndex)}...`} {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}

                        {questionFields.length === 0 && (
                            <div className="text-center py-12 border-2 border-dashed rounded-xl bg-muted/20">
                                <p className="text-muted-foreground">Chưa có câu hỏi nào. Hãy thêm câu hỏi đầu tiên!</p>
                                <Button type="button" variant="outline" onClick={addQuestion} className="mt-4 gap-2">
                                    <PlusCircle className="w-4 h-4" /> Thêm câu hỏi
                                </Button>
                            </div>
                        )}
                    </div>

                    <div className="flex justify-end gap-3 sticky bottom-4">
                        <Button type="button" variant="outline" onClick={() => navigate("/admin/quizzes")}>
                            Hủy
                        </Button>
                        <Button type="submit" className="min-w-[120px]">
                            {isEditMode ? "Lưu thay đổi" : "Tạo cuộc thi"}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
};

export default QuizForm;
