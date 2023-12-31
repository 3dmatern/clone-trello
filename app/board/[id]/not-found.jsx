import Link from "next/link";

export default function NotFound() {
    return (
        <div className="flex h-full flex-col items-center justify-center gap-2">
            <h2 className="text-xl font-semibold">404 Not Found</h2>
            <p>Не удалось найти запрошенню доску.</p>
            <Link
                href="/"
                className="p-2 mt-4 rounded-md bg-slate-300/50 hover:bg-slate-300/25 hover:scale-110 transition-all duration-700"
            >
                Вернуться назад
            </Link>
        </div>
    );
}
