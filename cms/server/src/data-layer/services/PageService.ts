import { PageModel } from "../models/schema";
import { LayoutConfig } from "../models/models";

export class PageService {
  /**
   * 获取某个页面的配置，如果不存在则创建一个空白记录
   */
  public async getPage(
    key: string
  ): Promise<{ title: string; layout: LayoutConfig }> {
    let page = await PageModel.findOne({ key });
    if (!page) {
      // 第一次请求时，自动创建
      page = new PageModel({
        key,
        title: "",                // 默认空标题
        layout: { sections: [] }, // 默认无节
      });
      await page.save();
    }
    return {
      title: page.title,
      layout: page.layout,
    };
  }

  /**
   * 更新某个页面的标题和布局
   */
  public async updatePage(
    key: string,
    title: string,
    layout: LayoutConfig
  ): Promise<boolean> {
    const res = await PageModel.findOneAndUpdate(
      { key },
      { title, layout },
      { new: true }
    );
    return !!res;
  }
}
