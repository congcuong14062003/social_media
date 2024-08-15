import { useEffect } from 'react';

const useToggleListener = (iconClassName, boxClassName = null) => {
    useEffect(() => {
        const handleToggleActive = (e) => {
            e.stopPropagation();
            const icon = document.querySelector(`.${iconClassName}`);
            const box = boxClassName ? document.querySelector(`.${boxClassName}`) : null;

            if (icon) {
                icon.classList.toggle("active");
            }

            // Check if box exists and click occurred inside the box
            if (box && box.contains(e.target)) {
                return;
            }

            // If click occurred outside the box or there's no boxClassName provided, remove active
            if (icon && !icon.contains(e.target)) {
                icon.classList.remove("active");
            }
        };

        document.addEventListener("click", handleToggleActive);

        return () => {
            document.removeEventListener("click", handleToggleActive);
        };
    }, [iconClassName, boxClassName]);
};

export default useToggleListener;
