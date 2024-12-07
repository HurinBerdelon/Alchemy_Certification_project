interface CardBackProps {
    name: string;
}

export function CardBack({ name }: Readonly<CardBackProps>) {
    return (
        <div className="w-[315px] h-[480px] border-4 border-white border-opacity-30 rounded-md flex items-center justify-center">
            <span className="text-xl font-bold opacity-30">{name}</span>
        </div>
    );
}
