import type { Cron } from "./cron";

declare function t<Str extends string>(input: Cron<Str>): void;

// Valid
t("* * * * *");
t("0 * * * *");
t("59 * * * *");
t("* 0 * * *");
t("* 23 * * *");
t("* * 1 * *");
t("* * 31 * *");
t("* * * 1 *");
t("* * * 12 *");
t("* * * * 0");
t("* * * * 6");

// Invalid
t("60 * * * *");
t("* 24 * * *");
t("* * 0 * *");
t("* * 32 * *");
t("* * * 0 *");
t("* * * 13 *");
t("* * * * 7");
