"use client";
import { Anchor, Text, Breadcrumbs as MantineBreadcrumbs } from "@mantine/core";
import { usePathname, useSearchParams } from "next/navigation";

export const Breadcrumbs = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const segments = pathname.split("/").filter((item) => item !== "");

  if (segments.length < 2) {
    return null;
  }

  const items = segments.map((item, index) => {
    const isLastIndex = index === segments.length - 1;

    let href = `/${segments.slice(0, index + 1).join("/")}`;
    if (index !== 0) {
      href = `${href}?${searchParams}`;
    }
    if (index === 1) {
      item = "recipe";
    }
    item = item.charAt(0).toUpperCase() + item.slice(1);
    if (isLastIndex) {
      return (
        <Text size="sm" key={item}>
          {item}
        </Text>
      );
    }
    return (
      <Anchor size="sm" href={href} key={index}>
        {item}
      </Anchor>
    );
  });

  return <MantineBreadcrumbs mt={"md"}>{items}</MantineBreadcrumbs>;
};
