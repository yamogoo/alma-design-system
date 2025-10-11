import { nextTick } from "vue";
import { flushPromises, mount, VueWrapper } from "@vue/test-utils";

import { FILES_TREE_PREFIX, type FilesTreeProps } from "./FilesTree";
import FilesTree from "./FilesTree.vue";

const Classes = {
  ROOT_CLASS: FILES_TREE_PREFIX,
};

const getRoot = <T>(wrapper: VueWrapper<T>) => {
  return wrapper.find(`[data-testid="${Classes.ROOT_CLASS}"]`);
};

const getLoadingMessage = <T>(wrapper: VueWrapper<T>) => {
  return wrapper.find(`[data-testid="${Classes.ROOT_CLASS}__loading-message"]`);
};

const getErrorMessage = <T>(wrapper: VueWrapper<T>) => {
  return wrapper.find(`[data-testid="${Classes.ROOT_CLASS}__error-message"]`);
};

type FilesTreeVm = InstanceType<typeof FilesTree>;

const REQUIRED_PROPS: FilesTreeProps = {
  apiUrl: "api/",
};

describe("FilesTree", () => {
  const fetchMock = vi.fn();

  beforeEach(() => {
    fetchMock.mockReset();
    vi.spyOn(global, "fetch").mockImplementation(fetchMock);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("classes", () => {
    test("should apply correct root class name", () => {
      const wrapper = mount(FilesTree, {
        props: { ...REQUIRED_PROPS },
      });

      const root = getRoot(wrapper);

      expect(root.exists()).toBeTruthy();
      expect(root.classes()).toContain(Classes.ROOT_CLASS);
    });
  });

  describe("props", () => {
    test("should render loading message fallback", async () => {
      const pendingResponse = new Promise<Response>(() => {});
      fetchMock.mockReturnValueOnce(pendingResponse);

      const loadingMessage = "Loading...";
      const wrapper = mount(FilesTree, {
        props: { ...REQUIRED_PROPS, apiLoadingMessage: loadingMessage },
      });

      await nextTick();

      const message = getLoadingMessage(wrapper);

      expect(message.exists()).toBeTruthy();
      expect(message.text()).toEqual(loadingMessage);
      expect(message.text()).toMatchInlineSnapshot(`"Loading..."`);
    });

    test("should render error message fallback", async () => {
      fetchMock.mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: vi.fn(),
      });

      const errorMessage = "Error occurred";
      const wrapper = mount(FilesTree, {
        props: { ...REQUIRED_PROPS, apiErrorMessage: errorMessage },
      });

      await flushPromises();

      const message = getErrorMessage(wrapper);

      expect(message.exists()).toBeTruthy();
      expect(message.text()).toEqual(errorMessage);
      expect(message.text()).toMatchInlineSnapshot(`"Error occurred"`);
    });
  });

  describe("slots", () => {
    test("should render loading message slot", () => {
      const slotContent = "Slot Content";
      const slot = `<p data-testid="slot">${slotContent}</p>`;

      const wrapper = mount(FilesTree, {
        props: { ...REQUIRED_PROPS },
        slots: { loading: slot },
      });

      const slotEl = wrapper.find(`[data-testid="slot"]`);
      const text = slotEl.text();

      expect(text).toEqual(slotContent);
      expect(text).toMatchInlineSnapshot(`"Slot Content"`);
    });

    test("should render error message slot", async () => {
      fetchMock.mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: vi.fn(),
      });

      const slotContent = "Slot Content";
      const slot = `<p data-testid="slot">${slotContent}</p>`;

      const wrapper = mount(FilesTree, {
        props: { ...REQUIRED_PROPS, apiErrorMessage: "Error" },
        slots: { error: slot },
      }) as VueWrapper<FilesTreeVm>;

      await flushPromises();

      const slotEl = wrapper.find(`[data-testid="slot"]`);
      const text = slotEl.text();

      expect(text).toEqual(slotContent);
      expect(text).toMatchInlineSnapshot(`"Slot Content"`);
    });
  });
});
