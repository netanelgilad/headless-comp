import clsx from "clsx";

export function Price(props: {
    amount: string;
    className?: string;
    currencyCode?: string;
    currencyCodeClass?: string;
}) {
    const currencyCode = props.currencyCode || "USD";

    return (
        <p className={props.className}>
            {
                `${new Intl.NumberFormat(undefined, {
                    style: "currency",
                    currency: currencyCode,
                    currencyDisplay: "narrowSymbol",
                }).format(parseFloat(props.amount))}`
            }
            <span className={clsx("ml-1 inline", props.currencyCodeClass)}
            >{`${currencyCode}`}</span
            >
        </p>
    );
}
