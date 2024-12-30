import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ChevronDownIcon } from 'lucide-react';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface NavMenuMoreProps {
  items: React.ReactNode[];
  className?: string;
  moreAction?: React.ReactNode | ((lastIndex: number) => React.ReactNode);
  gap?: number;
}

function NavMenuMore({ items, className, moreAction, gap = 16 }: NavMenuMoreProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [lastVisibleMenuItem, setLastVisibleMenuItem] = useState(-1);
  const [dimensions, setDimensions] = useState<{
    necessaryWidths: number[];
    moreActionWidth: number;
  }>({
    necessaryWidths: [],
    moreActionWidth: 0,
  });

  const getPrecalculatedWidths = (element: HTMLElement) => {
    const { width: containerWidth, left: containerLeft } = element.getBoundingClientRect();
    const children = Array.from(element.childNodes) as HTMLElement[];

    let moreActionWidth = 0;
    const necessaryWidths = children.reduce<number[]>((result, node) => {
      if (node.classList.contains('more-action')) {
        moreActionWidth = node.clientWidth;
        return result;
      }
      const rect = node.getBoundingClientRect();
      const width = rect.width + (rect.left - containerLeft) + gap;
      return [...result, width];
    }, []);

    return {
      moreActionWidth,
      necessaryWidths,
      containerWidth,
    };
  };

  const getLastVisibleItem = ({
    necessaryWidths,
    containerWidth,
    moreActionWidth,
  }: {
    necessaryWidths: number[];
    containerWidth: number;
    moreActionWidth: number;
  }) => {
    if (!necessaryWidths?.length) return 0;

    // 容器可以容纳最后一个元素，则全部显示
    if (necessaryWidths[necessaryWidths.length - 1] < containerWidth) {
      return necessaryWidths.length - 1;
    }

    // 容器不能容纳最后一个元素，则找出最后一个可见的元素
    const visibleItems = necessaryWidths.filter(width => {
      return width + moreActionWidth < containerWidth;
    });

    return visibleItems.length ? visibleItems.length - 1 : 0;
  };

  /**
   * 防止闪烁
   */
  useLayoutEffect(() => {
    const containerEl = containerRef.current;
    if (!containerEl) return;

    const { moreActionWidth, necessaryWidths, containerWidth } = getPrecalculatedWidths(containerEl);

    const itemIndex = getLastVisibleItem({
      containerWidth,
      necessaryWidths,
      moreActionWidth,
    });

    // 计算完成后，需要触发一次更新，显示计算后需要展示的元素
    setDimensions({ moreActionWidth, necessaryWidths });
    setLastVisibleMenuItem(itemIndex);
  }, [items, moreAction, gap]);

  useEffect(() => {
    if (!containerRef.current) return;

    const resizeObserver = new ResizeObserver(() => {
      const newIndex = getLastVisibleItem({
        containerWidth: containerRef.current!.getBoundingClientRect().width,
        necessaryWidths: dimensions.necessaryWidths,
        moreActionWidth: dimensions.moreActionWidth,
      });
      if (newIndex !== lastVisibleMenuItem) {
        setLastVisibleMenuItem(newIndex);
      }
    });

    resizeObserver.observe(containerRef.current);
    return () => {
      resizeObserver.disconnect();
    };
  }, [lastVisibleMenuItem, dimensions]);

  const isMoreVisible = lastVisibleMenuItem < items.length - 1;
  const filteredItems = items.filter((_, index) => index <= lastVisibleMenuItem);

  // -1时，为初始化，需要展示所有元素，用于计算宽度
  if (lastVisibleMenuItem === -1) {
    return (
      <div
        ref={containerRef}
        className={cn('nav-menu-more flex overflow-hidden', className)}
        style={{ gap: `${gap}px` }}
      >
        {items}
        <div className="more-action">
          {typeof moreAction === 'function' ? moreAction(lastVisibleMenuItem) : moreAction}
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className={cn('nav-menu-more flex overflow-hidden', className)} style={{ gap: `${gap}px` }}>
      {filteredItems}
      {isMoreVisible && (
        <div className="more-action">
          {typeof moreAction === 'function' ? moreAction(lastVisibleMenuItem) : moreAction}
        </div>
      )}
    </div>
  );
}

function NavMenuMoreDemo1() {
  return (
    <div className="mt-5 mx-auto w-4/5 rounded-xl shadow-2xl p-4 border border-green-500">
      <NavMenuMore
        items={menuData.map(v => (
          <Button key={v.id} variant="secondary">
            {v.name}
          </Button>
        ))}
        moreAction={
          <Button variant="secondary">
            更多
            <ChevronDownIcon className="size-4" />
          </Button>
        }
      />
    </div>
  );
}

function NavMenuMoreDemo2() {
  return (
    <div className="mt-5 mx-auto w-4/5 rounded-xl shadow-2xl p-4 border border-green-500">
      <NavMenuMore
        items={menuData.map(v => (
          <Button key={v.id} variant="secondary">
            {v.name}
          </Button>
        ))}
        moreAction={(lastIndex: number) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" className="focus-visible:ring-0">
                更多
                <ChevronDownIcon className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {menuData.slice(lastIndex + 1).map(v => (
                <DropdownMenuItem key={v.id}>{v.name}</DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      />
    </div>
  );
}

function App() {
  return (
    <div>
      <NavMenuMoreDemo1 />
      <NavMenuMoreDemo2 />
    </div>
  );
}

const menuData = [
  { name: '哆啦a梦', id: 1 },
  { name: '宇智波佐助', id: 2 },
  { name: '香蕉之王奥德彪', id: 3 },
  { name: '漩涡鸣人', id: 4 },
  { name: '雏田', id: 5 },
  { name: '大雄', id: 6 },
  { name: '源静香', id: 7 },
  { name: '骨川小夫', id: 8 },
  { name: '超级马里奥', id: 9 },
  { name: '自来也', id: 10 },
  { name: '孙悟空', id: 11 },
  { name: '卡卡罗特', id: 12 },
  { name: '万年老二贝吉塔', id: 13 },
  { name: '小泽玛丽', id: 14 },
];

export default App;


/**
 * 关联资料：
 * 
 * https://juejin.cn/post/7384256110280802356
 * https://www.developerway.com/posts/no-more-flickering-ui#part1
 */