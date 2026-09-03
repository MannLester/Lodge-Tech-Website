import { createClient } from "@supabase/supabase-js";
import { expect, test } from "@playwright/test";

const supabaseUrl = process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

test("persists an inquiry and removes the verification record", async ({
  page,
}, testInfo) => {
  test.skip(
    testInfo.project.name !== "desktop-chromium",
    "The persistence smoke test runs once in the desktop project.",
  );
  test.skip(
    !supabaseUrl || !serviceRoleKey,
    "A migrated test Supabase project is required for the persistence flow.",
  );
  testInfo.setTimeout(60_000);

  const email = `playwright-${Date.now()}@example.com`;
  const supabase = createClient(supabaseUrl!, serviceRoleKey!, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  try {
    await page.goto("/");
    const form = page.getByRole("form", { name: "Savings analysis inquiry" });

    await form.getByLabel("Name").fill("Playwright Verification");
    await form.getByLabel("Work email").fill(email);
    await form.getByLabel("Property or company").fill("Test Property");
    await form.getByLabel("Phone (optional)").fill("+1 202 555 0142");
    await form.getByLabel("Property type").selectOption("hospitality");
    await form
      .getByLabel("Project notes")
      .fill("Temporary persistence verification record.");
    await form.getByRole("button", { name: "Submit Inquiry" }).click();

    await expect(
      form.getByText(
        "Thanks. Your savings analysis request has been submitted.",
      ),
    ).toBeVisible();

    const { data, error } = await supabase
      .from("inquiries")
      .select("id, email, status")
      .eq("email", email)
      .single();

    expect(error).toBeNull();
    expect(data).toMatchObject({ email, status: "New" });
  } finally {
    await supabase.from("inquiries").delete().eq("email", email);
  }
});
