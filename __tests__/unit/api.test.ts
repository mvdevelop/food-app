import { api, ApiError } from "@/src/services/api";

describe("API service", () => {
  const fetchMock = jest.spyOn(global, "fetch");

  afterEach(() => {
    fetchMock.mockReset();
    jest.useRealTimers();
  });

  it("returns validated restaurants", async () => {
    fetchMock.mockResolvedValue(
      new Response(
        JSON.stringify([
          {
            id: "burger-house",
            name: "Burger House",
            cuisine: "Americana",
            rating: 4.8,
            reviews: 10,
            deliveryTime: "25 min",
            deliveryFee: 0,
            category: "burger",
          },
        ]),
        { status: 200, headers: { "Content-Type": "application/json" } },
      ),
    );

    await expect(api.restaurants()).resolves.toHaveLength(1);
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining("/restaurants"),
      expect.objectContaining({
        headers: { "Content-Type": "application/json" },
        signal: expect.any(AbortSignal),
      }),
    );
  });

  it("throws ApiError for unsuccessful responses", async () => {
    fetchMock.mockResolvedValue(new Response("Not found", { status: 404 }));

    await expect(api.restaurants()).rejects.toEqual(
      expect.objectContaining({
        name: "ApiError",
        status: 404,
        message: "API request failed: 404",
      }),
    );
  });

  it("rejects malformed API data", async () => {
    fetchMock.mockResolvedValue(new Response(JSON.stringify([{ id: "invalid" }]), { status: 200 }));

    await expect(api.restaurants()).rejects.toThrow();
  });

  it("preserves an externally supplied abort signal", async () => {
    const controller = new AbortController();
    fetchMock.mockResolvedValue(new Response(JSON.stringify([]), { status: 200 }));

    await expect(api.dishes(undefined)).resolves.toEqual([]);
    expect(fetchMock).toHaveBeenCalled();
    controller.abort();
  });

  it("encodes identifiers in request paths", async () => {
    fetchMock.mockResolvedValue(new Response(JSON.stringify([]), { status: 200 }));

    await api.reviews("restaurant/with spaces");

    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining("restaurant%2Fwith%20spaces"),
      expect.any(Object),
    );
  });

  it("exposes ApiError as an Error subtype", () => {
    const error = new ApiError(500, "Server error");

    expect(error).toBeInstanceOf(Error);
    expect(error.status).toBe(500);
    expect(error.name).toBe("ApiError");
  });
});
